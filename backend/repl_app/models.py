from django.db import models
from code import InteractiveInterpreter
from typing import Tuple
from io import StringIO
from contextlib import redirect_stderr, redirect_stdout



class REPLSessionInfo(models.Model):

    # def __init__(self, session, *args, **kwargs):
    #     '''
    #     Create a new REPLSession, assigning the instance variable
    #     `session` to be a new InteractiveInterpreter object
    #     '''
    #     self._session = session
    #     super().__init__(*args, **kwargs)
    pass


class REPLHistoryEntry(models.Model):
    '''
    Represents one command in the history of a REPL session
    '''
    session_info = models.ForeignKey(to=REPLSessionInfo, on_delete=models.CASCADE, related_name='entries')
    code = models.TextField()
    executed_at = models.DateTimeField()

    def __str__(self):
        if len(self.code) > 10:
            return self.code[:10] + '...'
        return self.code