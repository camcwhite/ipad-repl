from django.urls import path
from .views import NewCommandView, NewSessionView, NewDeviceTokenView

urlpatterns = [
    path('python/new-command/', NewCommandView.as_view()),
    path('python/new-session/', NewSessionView.as_view()),
    # path('python/end-session/', EndSessionView.as_view()),
    path('new-device-token/', NewDeviceTokenView.as_view()),
]