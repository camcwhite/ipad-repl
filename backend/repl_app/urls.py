from django.urls import path
from .views import NewCommandView, NewSessionView, EndSessionView

urlpatterns = [
    path('new-command/', NewCommandView.as_view()),
    path('new-session/', NewSessionView.as_view()),
    path('end-session/', EndSessionView.as_view()),
]