from django.http import JsonResponse
from django.shortcuts import render
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie

import boto3
import json


##########################################################
#   AWS Resources
##########################################################
def get_boto3_session():
    if settings.USE_IAM_ROLE:
        session = boto3.session.Session(region_name='ap-northeast-2')
    else:
        session = boto3.session.Session(profile_name=settings.AWS_PROFILE, region_name='ap-northeast-2')
    return session


@ensure_csrf_cookie
def index(request):
    context = {}
    return render(request, "console/ec2_instances.html", context=context)


def describe_instances(request):
    ec2 = get_boto3_session().resource('ec2')

    response_data = []
    instances = ec2.instances.all()

    for instance in instances:
        if instance.tags is None:
            return None

        for tag in instance.tags:
            if tag['Key'] == 'Name':
                instance_name = tag['Value']

        response_data.append({
            "id": instance.id,
            "name": instance_name,
            "launch_time": instance.launch_time,
            "instance_type": instance.instance_type,
            "public_ip_address": instance.public_ip_address,
            "image": instance.image.id,
            "state": instance.state["Name"]
        })

    return JsonResponse({
        'message': '2000',
        'data': response_data,
    }, json_dumps_params={'ensure_ascii': True})


def start_instances(request):
    json_data = json.loads(request.body.decode("utf-8"))
    instance_ids = json_data['instance_ids']

    ec2 = get_boto3_session().resource('ec2')
    ec2.instances.filter(InstanceIds=instance_ids).start()

    response_data = []
    return JsonResponse({
        'message': '2000',
        'data': response_data,
    }, json_dumps_params={'ensure_ascii': True})


def stop_instances(request):
    json_data = json.loads(request.body.decode("utf-8"))
    instance_ids = json_data['instance_ids']

    ec2 = get_boto3_session().resource('ec2')
    ec2.instances.filter(InstanceIds=instance_ids).stop()

    response_data = []
    return JsonResponse({
        'message': '2000',
        'data': response_data,
    }, json_dumps_params={'ensure_ascii': True})


def reboot_instances(request):
    json_data = json.loads(request.body.decode("utf-8"))
    instance_ids = json_data['instance_ids']

    ec2 = get_boto3_session().resource('ec2')
    ec2.instances.filter(InstanceIds=instance_ids).reboot()

    response_data = []
    return JsonResponse({
        'message': '2000',
        'data': response_data,
    }, json_dumps_params={'ensure_ascii': True})


##########################################################
#   Terraform
##########################################################
def tf_cicd_asg(request):
    context = {}
    return render(request, "console/tf_cicd_asg.html", context=context)


def tf_cicd_ec2(request):
    return render(request, "console/tf_cicd_ec2.html")


##########################################################
#   Samples
##########################################################
def get_instances_by_tag_value(tag, value):
    ec2 = get_boto3_session().resource('ec2')
    instances = ec2.instances.filter(Filters=[{'Name': 'tag:' + tag, 'Values': [value]}])

    for instance in instances:
        print(
            "Id: {0}\nPlatform: {1}\nType: {2}\nPublic IPv4: {3}\nAMI: {4}\nState: {5}\n".format(
                instance.id, instance.platform, instance.instance_type, instance.public_ip_address, instance.image.id,
                instance.state
            )
        )

    return instances


def describe_instances_by_client(request):
    ec2 = get_boto3_session().client('ec2')
    response = ec2.describe_instances()
    instances = response['Reservations']

    return JsonResponse({
        'message': '2000',
        'items': instances,
    }, json_dumps_params={'ensure_ascii': True})
