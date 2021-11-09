from json.decoder import JSONDecodeError
from django.http.response import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.shortcuts import render
from django.views import View
from .models import REPLSessionInfo, DeviceToken
from .sessions import REPLSession
import json
import secrets

def get_json(request, *args):
    '''
    Turn the body of a request into a json and return it

    Returns None if request body is not a json
    '''
    try:
        data = json.loads(request.body)
        if any(map(lambda arg: type(data.get(arg[0], None)) != arg[1], args)):
            return None
        return data
    except JSONDecodeError:
        return None

class NewDeviceTokenView(View):

    def get(self, request, *args, **kwarfs):
        token = None
        while token is None or len(DeviceToken.objects.filter(token=token)) != 0:
            token = secrets.token_hex(32)
        DeviceToken(token=token).save()
        return HttpResponse(json.dumps({ 'device_token': token }))

class NewSessionView(View):

    def post(self, request, *args, **kwargs):
        request_data = get_json(request, ('device_token', str))
        if request_data is None:
            return HttpResponseBadRequest("Please post a JSON with a 'device_token' key")
        device_token_str = request_data.get('device_token', None)
        try:
            device_token = DeviceToken.objects.get(token=device_token_str)
        except DeviceToken.DoesNotExist:
            return HttpResponseBadRequest("Device token not found")
        for session_info in device_token.sessions.all():
            session_info.delete()
        new_session_info = REPLSessionInfo(device_token=device_token)
        new_session_info.save()
        return HttpResponse(json.dumps({ 'session_id': new_session_info.id }))

# class EndSessionView(View):

#     def post(self, request, *args, **kwargs):
#         request_data = get_json(request, ('session_id', int), ('device_token', str))
#         if request_data is None:
#             return HttpResponseBadRequest("Please post a JSON with 'session_id' and 'device_token' keys")
#         session_id = request_data.get('session_id', None)
#         device_token = request_data.get('device_token', None)
#         print(f'Deleting {session_id}', flush=True)
#         if session_id is None:
#             return HttpResponseBadRequest("Please specify a session to delete with 'session_id'")
#         elif device_token is None:
#             return HttpResponseBadRequest("Please specify a device_token to delete with 'device_token'")

#         num_deleted, _ = REPLSessionInfo.objects.filter(id=session_id).delete()
#         if not num_deleted:
#             return HttpResponseNotFound(f"Session #{session_id} not found.")
#         return HttpResponse(f"Session {session_id} deleted.") 

class NewCommandView(View):

    def post(self, request, *args, **kwargs):
        request_data = get_json(request, ('session_id', int), ('code', str))
        if request_data is None:
            return HttpResponseBadRequest("Please post a JSON with 'session_id' and 'code' keys")
        code = request_data.get('code', '')
        session_id = request_data.get('session_id', 0)
        session = REPLSession.load_session(session_id)
        output, need_more = session.execute(code)
        session.save()
        return HttpResponse(json.dumps({'output': output, 'unfinished': need_more}))