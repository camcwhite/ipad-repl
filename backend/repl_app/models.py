from django.db import models

class REPLSessionInfo(models.Model):

    # def __init__(self, session, *args, **kwargs):
    #     '''
    #     Create a new REPLSession, assigning the instance variable
    #     `session` to be a new InteractiveInterpreter object
    #     '''
    #     self._session = session
    #     super().__init__(*args, **kwargs)
    
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