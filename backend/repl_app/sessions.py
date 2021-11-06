from typing import Tuple, Type, TypeVar
from .models import REPLHistoryEntry, REPLSessionInfo
from code import compile_command
from traceback import format_exception, print_exception
from RestrictedPython import utility_builtins
from io import StringIO
from contextlib import redirect_stderr, redirect_stdout
import sys
# from datetime import datetime
from django.utils import timezone

T = TypeVar('T', bound='REPLSession')

class StringBuffer(StringIO):

    def __init__(self, default_out, *args, **kwargs):
        self.default_out = default_out
        super().__init__(*args, **kwargs)

    def write(self, lines, *args):
        _stdout = sys.stdout
        sys.stdout = self.default_out
        print(f'writing: {lines}')
        sys.stdout = _stdout
        super().write(lines, *args)


class REPLSession:
    '''
    Represents an active REPL session
    '''

    def __init__(self, repl_info:REPLSessionInfo=None):
        '''
        Initialize a new REPL session ready to execure code.

        If repl_history is provided, executes all the commands in repl_history
        ''' 
        # self.session = InteractiveInterpreter() 
        self._locals = {}
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
        '''
        session_info = REPLSessionInfo.objects.get(id=id)
        if id in cls._cached_sessions:
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
        with redirect_stdout(output_stream), redirect_stderr(output_stream):
            executed_at = timezone.now()
            need_more = False
            compiled_code = False
            try:
                compiled_code = compile_command(code)
            except SyntaxError as e:
                exc_data = format_exception(e)
                exc_lines = exc_data[0:1] + exc_data[6:]
                print(''.join(exc_lines))

            if compiled_code is not False:
                try:
                    need_more = compiled_code == None
                    if compiled_code is not None:
                        exec(compiled_code, utility_builtins, self._locals)
                except SystemExit as e:
                    print('Please use the button to exit.')
                except Exception as e:
                    exc_data = format_exception(e)
                    exc_lines = exc_data[0:1] + exc_data[2:]
                    print(''.join(exc_lines))
        if save and not need_more:
            REPLHistoryEntry(code=code, session_info=self.session_info, executed_at=executed_at).save()
        out = output_stream.getvalue()
        while out.endswith('\n'):
            out = out[:-1]
        print(repr(out),flush=True)
        return out, need_more