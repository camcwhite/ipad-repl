from django.contrib import admin
from .models import REPLSessionInfo, REPLHistoryEntry

# Register your models here.
admin.site.register(REPLSessionInfo)
admin.site.register(REPLHistoryEntry)