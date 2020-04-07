from django.urls import path

from . import views

# urlpatterns = [
#     # ex: /polls/
#     path('', views.index, name='index'),
#     # ex: /polls/5/
#     path('<int:question_id>/', views.detail, name='detail'),
#     # ex: /polls/5/results/
#     path('<int:question_id>/results/', views.results, name='results'),
#     # ex: /polls/5/vote/
#     path('<int:question_id>/vote/', views.vote, name='vote'),
# ]

urlpatterns = [
    path("", views.index, name="ec2_instances"),
    path("ec2/", views.index, name="ec2_instances"),
    path('ec2/describe_instances', views.describe_instances, name='describe_instances'),
    path('ec2/start-instances', views.start_instances, name='start_instances'),
    path('ec2/stop-instances', views.stop_instances, name='stop_instances'),
    path('ec2/reboot-instances', views.reboot_instances, name='reboot_instances'),

    path('tf/cicd-asg', views.tf_cicd_asg, name='tf_cicd_asg'),
    path('tf/cicd-ec2', views.tf_cicd_ec2, name='tf_cicd_ec2'),
]
