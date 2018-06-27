from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from company import views

from welcome.views import index, health

urlpatterns = [
    url(r'^health$', health),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^set_houzz$', views.set_houzz),
    url(r'^houzz.json$', views.houzz_json),
    url(r'^houzz$', views.houzz),
    url(r'^set_myremont$', views.set_myremont),
    url(r'^myremont.json$', views.myremont_json),
    url(r'^myremont$', views.myremont),
    url(r'^eshop$', views.eshop),
    url(r'^eshopget$', views.eshop_get),
    url(r'^eshop_get_id$', views.eshop_get_id),
    url(r'^eshop_set_description$', views.eshop_set_description),
    url(r'^eshop.json$', views.eshop_json),
    url(r'^eshop_table$', views.eshop_table),
    url(r'^eshop.csv$', views.eshop_csv),
    url(r'^eshopget$', views.eshop_get),
    url(r'^watch_img_get$', views.watch_img_get),
    url(r'^watch_img.json$', views.watch_img_json),
    url(r'^watch_img_table$', views.watch_img_table),
    url(r'^parce1_get$', views.parce1_get),
    url(r'^parce2_get$', views.parce2_get),
    url(r'^parce1_del$', views.parce1_del_get),
    url(r'^parce1.json$', views.parce1_json),
    url(r'^parce1_table$', views.parce1_table),
    url(r'^kovale_xml$', views.kovale_xml),
    url(r'^watch_clear$', views.watch_clear),
    url(r'^parce_klatch_get$', views.parce_klatch_get),
    url(r'^parce_klatch_table$', views.parce_klatch_table),
    url(r'^forus_xml$', views.forus_xml),
    url(r'^parce1_set$', views.parce1_set),
    url(r'^tr_igruski$', views.tr_igruski),
    url(r'^all_in_xml$', views.all_in_xml),
    url(r'^tr_child_clothes$', views.tr_child_clothes),
    url(r'^tr_child_igruski$', views.tr_child_igruski),
    url(r'^tr_cufrovi$', views.tr_cufrovi),
    url(r'^tr_bags$', views.tr_bags),





    url(r'^$', views.main, name='index'),
]


if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
