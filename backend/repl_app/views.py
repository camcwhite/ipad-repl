from django.http.response import HttpResponse
from django.shortcuts import render
from django.views import View
from .models import REPLSessionInfo
from .sessions import REPLSession
import json

class NewSessionView(View):

    def get(self, request, *args, **kwargs):
        new_session_info = REPLSessionInfo()
        new_session_info.save()
        return HttpResponse(json.dumps({ 'session_id': new_session_info.id }))

class NewCommandView(View):

    def post(self, request, *args, **kwargs):
        request_data = json.loads(request.body)
        code = request_data.get('code', '')
        session_id = request_data.get('session_id', 0)
        session = REPLSession.load_session(session_id)
        output, need_more = session.execute(code)
        session.save()
        return HttpResponse(json.dumps({'output': output, 'unfinished': need_more}))