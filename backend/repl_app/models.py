from django.db import models
from code import InteractiveInterpreter
from typing import Tuple
from io import StringIO
from contextlib import redirect_stderr, redirect_stdout

class DeviceToken(models.Model):
    token = models.CharField(max_length=64, unique=True)

    def __str__(self) -> str:
        return self.token

class REPLSessionInfo(models.Model):
    device_token = models.ForeignKey(to=DeviceToken, on_delete=models.CASCADE, related_name="sessions")

    @property
    def cached_session(self):
        try:
            return self._cached_session
        except AttributeError:
            return None

    def cache_session(self, session):
        '''
        Cache a session object
        '''
        self._cached_session = session


code_preview_len = 20
class REPLHistoryEntry(models.Model):
    '''
    Represents one command in the history of a REPL session
    '''
    session_info = models.ForeignKey(to=REPLSessionInfo, on_delete=models.CASCADE, related_name='entries')
    code = models.TextField()
    executed_at = models.DateTimeField()

    def __str__(self):
        if len(self.code) > code_preview_len:
            return self.code[:code_preview_len] + '...'
        return self.code