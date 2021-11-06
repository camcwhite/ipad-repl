from typing import Tuple, Type, TypeVar
from .models import REPLHistoryEntry, REPLSessionInfo
from code import InteractiveInterpreter
from io import StringIO
from contextlib import redirect_stderr, redirect_stdout
from datetime import datetime

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

    # @property
    # def session(self):
    #     return self._session    

    @classmethod
    def load_session(cls:Type[T], id:int) -> T:
        '''
        Loads the session with id `id` or returns a new session if
        `id` is 0

        TODO: Add caching of sessions so all commands don't have to be re-executed
        every time a command is run
        '''
        # if id == 0:
        #     return InteractiveInterpreter()
        # session_model = cls.objects.get(id=id)
        return cls(repl_info=REPLSessionInfo.objects.get(id=id))

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
                executed_at = datetime.now()
                need_more = self.session.runsource(code)
        if save and not need_more:
            REPLHistoryEntry(code=code, session_info=self.session_info, executed_at=executed_at).save()
        return output_stream.getvalue(), need_more