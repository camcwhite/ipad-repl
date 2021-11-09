from django.contrib import admin
from .models import DeviceToken, REPLSessionInfo, REPLHistoryEntry

# Register your models here.
admin.site.register(REPLSessionInfo)
admin.site.register(REPLHistoryEntry)
admin.site.register(DeviceToken)