from django.http.response import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
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

class EndSessionView(View):

    def post(self, request, *args, **kwargs):
        request_data = json.loads(request.body)
        session_id = request_data.get('session_id', 0)
        print(f'Deleting {session_id}', flush=True)
        if session_id == 0:
            return HttpResponseBadRequest("Please specify a session to delete with 'session_id'")
        num_deleted, _ = REPLSessionInfo.objects.filter(id=session_id).delete()
        if not num_deleted:
            return HttpResponseNotFound(f"Session #{session_id} not found.")
        return HttpResponse(f"Session {session_id} deleted.") 


class NewCommandView(View):

    def get(self, request, *args, **kwargs):
        return HttpResponse(f"Try Using POST instead!")

    def post(self, request, *args, **kwargs):
        request_data = json.loads(request.body)
        code = request_data.get('code', '')
        session_id = request_data.get('session_id', 0)
        session = REPLSession.load_session(session_id)
        output, need_more = session.execute(code)
        session.save()
        return HttpResponse(json.dumps({'output': output, 'unfinished': need_more}))