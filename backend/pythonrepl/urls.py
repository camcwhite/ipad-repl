from django.urls import path
from .views import NewCommandView

urlpatterns = [
    path('new-command/', NewCommandView.as_view())
]