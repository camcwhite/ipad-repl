from typing import Tuple, Type, TypeVar
from .models import REPLHistoryEntry, REPLSessionInfo
from code import InteractiveInterpreter
import threading
from io import StringIO
from contextlib import redirect_stderr, redirect_stdout
import sys
from django.utils import timezone
import inspect
import ctypes

T = TypeVar('T', bound='REPLSession')

MAX_OUT_LEN = 10_000

TIMEOUT = 5 # seconds
ALLOWED_IMPORTS = {'math', 'time'}
REMOVED_BUILTINS = {
    'open',
    'input',
    'quit',
    'exit',
}
IMPORT_ERROR = False

def _async_raise(tid, exctype):
    '''Raises an exception in the threads with id tid'''
    if not inspect.isclass(exctype):
        raise TypeError("Only types can be raised (not instances)")
    res = ctypes.pythonapi.PyThreadState_SetAsyncExc(ctypes.c_long(tid),
                                                     ctypes.py_object(exctype))
    if res == 0:
        raise ValueError("invalid thread id")
    elif res != 1:
        # "if it returns a number greater than one, you're in trouble,
        # and you should call it again with exc=NULL to revert the effect"
        ctypes.pythonapi.PyThreadState_SetAsyncExc(ctypes.c_long(tid), None)
        raise SystemError("PyThreadState_SetAsyncExc failed")

class StoppableThread(threading.Thread):
    '''
    A thread class that supports stopping via raising an exception in the 
    thread from another thread.

    source https://stackoverflow.com/a/325528/17005182
    '''
    def _get_my_tid(self):
        """determines this (self's) thread id

        CAREFUL: this function is executed in the context of the caller
        thread, to get the identity of the thread represented by this
        instance.
        """
        if not self.is_alive():
            raise threading.ThreadError("the thread is not active")

        # do we have it cached?
        if hasattr(self, "_thread_id"):
            return self._thread_id

        # no, look for it in the _active dict
        for tid, tobj in threading._active.items():
            if tobj is self:
                self._thread_id = tid
                return tid

        raise AssertionError("could not determine the thread's id")

    def stop(self, exctype):
        '''
        Raises the given exception type in the context of this thread.
        '''
        _async_raise( self._get_my_tid(), exctype )

class REPLSession:
    '''
    Represents an active REPL session
    '''

    def __init__(self, repl_info:REPLSessionInfo=None):
        '''
        Initialize a new REPL session ready to execure code.

        If repl_history is provided, executes all the commands in repl_history
        ''' 
        def safe_import(name, *args):
            if name not in ALLOWED_IMPORTS:
                self._import_error = name
                return
                # raise ImportError(name)
            try: 
                print(f'{name} is good')
                return __import__(name, *args)
            except ImportError:
                pass

        print('creating new interpreter', flush=True)
        new_builtins = {k:v for k,v in __builtins__.items()}
        new_builtins['__import__'] = safe_import
        self.session = InteractiveInterpreter(locals={'safe_import': safe_import, '__builtins__': new_builtins}) 
        self.session.runsource("__builtins__['__import__'] = safe_import")
        for name in REMOVED_BUILTINS:
            self._remove_builtin(name)
        self._import_error = None
        self.session_info = repl_info
        if repl_info:
            for entry in repl_info.entries.all():
                self._execute_entry(entry)

    def _remove_builtin(self, name:str) -> None:
        self.session.runsource(f"del __builtins__['{name}']")

    _cached_sessions = {}

    @classmethod
    def load_session(cls:Type[T], id:int) -> T:
        '''
        Loads the session with id `id` or returns a new session if
        `id` is 0

        TODO: Add caching of sessions so all commands don't have to be re-executed
        every time a command is run
        '''
        session_info = REPLSessionInfo.objects.get(id=id)
        if id in cls._cached_sessions:
            print('getting cached session')
            session = cls._cached_sessions[id]
        else:
            session = cls(repl_info=session_info)
            cls._cached_sessions[id] = session
        return session 

    def save(self) -> None:
        '''
        Saves this session to the database 
        '''
        self.session_info.save()

    def _execute_entry(self, entry:REPLHistoryEntry):
        '''
        Execute a history entry in this session 
        '''
        self.execute(entry.code, save=False)

    def execute(self, code:str, save:bool=True) -> Tuple[str, bool]:
        '''
        Executes a piece of code in this session's interpreter.

        If save is True (default), saves the code to this sessions
        info history
        '''
        output_stream = StringIO()
        timeout = False
        with redirect_stdout(output_stream), redirect_stderr(output_stream):
            executed_at = timezone.now()
            global IMPORT_ERROR
            try:
                # need_more = self.session.runsource(code)
                # need_more = False
                need_more_dict = {'need_more': False}
                def do_runsource():
                    need_more_dict['need_more'] = self.session.runsource(code)

                runsource_thread = StoppableThread(target=do_runsource)
                runsource_thread.start()
                runsource_thread.join(TIMEOUT)

                need_more = need_more_dict['need_more']
                if runsource_thread.is_alive():
                    # a thread to stop the running thread
                    threading.Thread(target=lambda: runsource_thread.stop(TimeoutError)).start()
                    timeout = True

                if self._import_error is not None:
                    print(f'That import is not allowed. Allowed Imports are:\n{ALLOWED_IMPORTS}')
                    self.session.runsource(f'del {self._import_error}')
                    need_more = False
                    self._import_error = None
            except SystemExit as e:
                print('Please use the button to exit.')
                need_more = False

        if save and not timeout and not need_more:
            REPLHistoryEntry(code=code, session_info=self.session_info, executed_at=executed_at).save()
        
        out = output_stream.getvalue()[:MAX_OUT_LEN] if not timeout else f'Computation timed out (timeout is {TIMEOUT} seconds)'
        while out.endswith('\n'):
            out = out[:-1]
        # print(out,flush=True)
        return out, need_more
