from django.urls import path
from .views import NewCommandView, NewSessionView

urlpatterns = [
    path('new-command/', NewCommandView.as_view()),
    path('new-session/', NewSessionView.as_view()),
]