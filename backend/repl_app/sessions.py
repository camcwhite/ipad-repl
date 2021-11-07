from typing import Tuple, Type, TypeVar
from .models import REPLHistoryEntry, REPLSessionInfo
from code import InteractiveInterpreter
from io import StringIO
from contextlib import redirect_stderr, redirect_stdout
# from datetime import datetime
from django.utils import timezone

T = TypeVar('T', bound='REPLSession')

class REPLSession:
    '''
    Represents an active REPL session
    '''

    def __init__(self, repl_info:REPLSessionInfo=None):
        '''
        Initialize a new REPL session ready to execure code.

        If repl_history is provided, executes all the commands in repl_history
        ''' 
        print('creating new interpreter', flush=True)
        self.session = InteractiveInterpreter() 
        self.session_info = repl_info
        if repl_info:
            for entry in repl_info.entries.all():
                self._execute_entry(entry)

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
        with redirect_stdout(output_stream):
            with redirect_stderr(output_stream):
                executed_at = timezone.now()
                try:
                    need_more = self.session.runsource(code)
                except SystemExit as e:
                    print('Please use the button to exit.')
                    need_more = False
        if save and not need_more:
            REPLHistoryEntry(code=code, session_info=self.session_info, executed_at=executed_at).save()
        out = output_stream.getvalue()
        while out.endswith('\n'):
            out = out[:-1]
        print(repr(out),flush=True)
        return out, need_more
