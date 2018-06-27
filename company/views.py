# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.http import JsonResponse
from pyexcel_xlsx import get_data, save_data
import json
import logging
from parce.settings import BASE_DIR
from company.models import Houzz , Eshop, Myremont, Watch, WatchPrice, PriceAttr
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import os
import urllib
from xml.etree import ElementTree as ET
from xml.dom import minidom
from django.http import HttpResponse
import requests


def main(request):
    args = {}
    return render_to_response('p1.html', args)
# Create your views here.

def set_houzz(request):
    name = request.GET['name']
    siteUrl = request.GET['siteUrl']
    phone = request.GET['phone']
    site = request.GET['site']
    city = request.GET['city']
    try:
        parce = Houzz.objects.get(siteUrl=siteUrl)
    except ObjectDoesNotExist:
        parce = Houzz.objects.create(
            name = name,
            siteUrl = siteUrl,
            phone = phone,
            site = site,
            oblast = city
        )
        parce.save()
    else:
        parce.name = name
        parce.siteUrl = siteUrl
        parce.phone = phone
        parce.site = site
        parce.oblast = city
        parce.save()
        return JsonResponse('Duplicate', safe=False)
    return JsonResponse('OK', safe=False)


def houzz_json(request):
    result_list = []
    designer = Houzz.objects.all();
    [result_list.append(r.as_dict()) for r in designer]
    result_dict = {
        'draw': 1,
        'totalRecords': len(result_list),
        'filteredRecords': len(result_list),
        'data': result_list
    }
    return JsonResponse(result_dict, safe=False)

def houzz(request):
    args = {}
    return render_to_response('houzz.html', args)

def eshop(request):
    args = {}
    #Eshop.objects.all().delete()
    return render_to_response('p1.html', args)


def eshop_get(request):
    args = {}
    data = get_data(BASE_DIR+'\static\export-products-20.xlsx')
    #jdata = json.dumps(data['Лист1'])
    title_row = ['Код_товара',
                'Название_позиции',
                'Ключевые_слова',
                'Описание',
                'Тип_товара',
                'Цена',
                'Валюта',
                'Единица_измерения',
                'Минимальный_объем_заказа',
                'Оптовая_цена',
                'Минимальный_заказ_опт',
                'Ссылка_изображения',
                'Наличие',
                'Количество',
                'Номер_группы',
                'Название_группы',
                'Адрес_подраздела',
                'Возможность_поставки',
                'Срок_поставки',
                'Способ_упаковки',
                'Уникальный_идентификатор',
                'Идентификатор_товара',
                'Идентификатор_подраздела',
                'Идентификатор_группы',
                'Производитель',
                'Гарантийный_срок',
                'Страна_производитель',
                'Скидка',
                'ID_группы_разновидностей',
                'Метки',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики',
                'Название_Характеристики',
                'Измерение_Характеристики',
                'Значение_Характеристики']
    rowShopList = Eshop.objects.filter(Q(edit = True) or Q(newcol0 = True)).exclude(newcol=None).distinct()
    for row in data['Export Products Sheet']:
        if row[0] != 'Код_товара':
            try:
                rowShop = rowShopList.get(col1 = row[0])
            except ObjectDoesNotExist:
                if 1 == 1:
                    rowShop = Eshop.objects.create(
                        col1 = row[0]
                    )
                    rowShop.newcol0 = True;
                    rowShop.col2 = row[1]
                    rowShop.col3 = row[2]
                    rowShop.col4 = row[3]
                    rowShop.col5 = row[4]
                    rowShop.col6 = row[5]
                    rowShop.col7 = row[6]
                    rowShop.col8 = row[7]
                    rowShop.col9 = row[8]
                    rowShop.col10 = row[9]
                    rowShop.col11 = row[10]
                    rowShop.col12 = row[11]
                    rowShop.col13 = row[12]
                    rowShop.col14 = row[13]
                    rowShop.col15 = row[14]
                    rowShop.col16 = row[15]
                    rowShop.col17 = row[16]
                    rowShop.col18 = row[17]
                    rowShop.col19 = row[18]
                    rowShop.col20 = row[19]
                    rowShop.col21 = row[20]
                    rowShop.col22 = row[21]
                    rowShop.col23 = row[22]
                    rowShop.col24 = row[23]
                    rowShop.col25 = row[24]
                    rowShop.col26 = row[25]
                    rowShop.col27 = row[26]
                    rowShop.col28 = row[27]
                    rowShop.col29 = row[28]
                    rowShop.col30 = row[29]
                    rowShop.col31 = row[30]
                    rowShop.col32 = row[31]
                    rowShop.col33 = row[32]
                    try:
                        rowShop.col34 = row[33]
                    except:
                        pass
                    try:
                        rowShop.col35 = row[34]
                    except:
                        pass
                    try:
                        rowShop.col36 = row[35]
                    except:
                        pass
                    try:
                        rowShop.col37 = row[36]
                    except:
                        pass
                    try:
                        rowShop.col38 = row[37]
                    except:
                        pass
                    try:
                        rowShop.col39 = row[38]
                    except:
                        pass
                    try:
                        rowShop.col40 = row[39]
                    except:
                        pass
                    try:
                        rowShop.col41 = row[40]
                    except:
                        pass
                    try:
                        rowShop.col42 = row[41]
                    except:
                        pass
                    try:
                        rowShop.col43 = row[42]
                    except:
                        pass
                    try:
                        rowShop.col44 = row[43]
                    except:
                        pass
                    try:
                        rowShop.col45 = row[44]
                    except:
                        pass
                    try:
                        rowShop.col46 = row[45]
                    except:
                        pass
                    try:
                        rowShop.col47 = row[46]
                    except:
                        pass
                    try:
                        rowShop.col48 = row[47]
                    except:
                        pass
                    try:
                        rowShop.col49 = row[48]
                    except:
                        pass
                    try:
                        rowShop.col50 = row[49]
                    except:
                        pass
                    try:
                        rowShop.col51 = row[50]
                    except:
                        pass
                    try:
                        rowShop.col52 = row[51]
                    except:
                        pass
                    try:
                        rowShop.col53 = row[52]
                    except:
                        pass
                    try:
                        rowShop.col54 = row[53]
                    except:
                        pass
                    try:
                        rowShop.col55 = row[54]
                    except:
                        pass
                    try:
                        rowShop.col56 = row[55]
                    except:
                        pass
                    try:
                        rowShop.col57 = row[56]
                    except:
                        pass
                    try:
                        rowShop.col58 = row[57]
                    except:
                        pass
                    try:
                        rowShop.col59 = row[58]
                    except:
                        pass
                    try:
                        rowShop.col60 = row[59]
                    except:
                        pass
                    try:
                        rowShop.col61 = row[60]
                    except:
                        pass
                    try:
                        rowShop.col62 = row[61]
                    except:
                        pass
                    try:
                        rowShop.col63 = row[62]
                    except:
                        pass
                    try:
                        rowShop.col64 = row[63]
                    except:
                        pass
                    try:
                        rowShop.col65 = row[64]
                    except:
                        pass
                    try:
                        rowShop.col66 = row[65]
                    except:
                        pass
                    try:
                        rowShop.col67 = row[66]
                    except:
                        pass
                    try:
                        rowShop.col68 = row[67]
                    except:
                        pass
                    try:
                        rowShop.col69 = row[68]
                    except:
                        pass
                    try:
                        rowShop.col70 = row[69]
                    except:
                        pass
                    try:
                        rowShop.col71 = row[70]
                    except:
                        pass
                    try:
                        rowShop.col72 = row[71]
                    except:
                        pass
                    try:
                        rowShop.col73 = row[72]
                    except:
                        pass
                    try:
                        rowShop.col74 = row[73]
                    except:
                        pass
                    try:
                        rowShop.col75 = row[74]
                    except:
                        pass
                    try:
                        rowShop.col76 = row[75]
                    except:
                        pass
                    try:
                        rowShop.col77 = row[76]
                    except:
                        pass
                    try:
                        rowShop.col78 = row[77]
                    except:
                        pass
                    try:
                        rowShop.col79 = row[78]
                    except:
                        pass
                    try:
                        rowShop.col80 = row[79]
                    except:
                        pass
                    try:
                        rowShop.col81 = row[80]
                    except:
                        pass
                    try:
                        rowShop.col82 = row[81]
                    except:
                        pass
                    try:
                        rowShop.col83 = row[82]
                    except:
                        pass
                    try:
                        rowShop.col84 = row[83]
                    except:
                        pass
                    try:
                        rowShop.col85 = row[84]
                    except:
                        pass
                    try:
                        rowShop.col86 = row[85]
                    except:
                        pass
                    try:
                        rowShop.col87 = row[86]
                    except:
                        pass
                    rowShop.save()
            else:
                #rowShop.newcol =  row[3];
                #rowShop.save()
                if 1 == 2:
                    rowShop.col2 = row[1]
                    rowShop.col3 = row[2]
                    rowShop.col4 = row[3]
                    rowShop.col5 = row[4]
                    rowShop.col6 = row[5]
                    rowShop.col7 = row[6]
                    rowShop.col8 = row[7]
                    rowShop.col9 = row[8]
                    rowShop.col10 = row[9]
                    rowShop.col11 = row[10]
                    rowShop.col12 = row[11]
                    rowShop.col13 = row[12]
                    rowShop.col14 = row[13]
                    rowShop.col15 = row[14]
                    rowShop.col16 = row[15]
                    rowShop.col17 = row[16]
                    rowShop.col18 = row[17]
                    rowShop.col19 = row[18]
                    rowShop.col20 = row[19]
                    rowShop.col21 = row[20]
                    rowShop.col22 = row[21]
                    rowShop.col23 = row[22]
                    rowShop.col24 = row[23]
                    rowShop.col25 = row[24]
                    rowShop.col26 = row[25]
                    rowShop.col27 = row[26]
                    rowShop.col28 = row[27]
                    rowShop.col29 = row[28]
                    rowShop.col30 = row[29]
                    rowShop.col31 = row[30]
                    rowShop.col32 = row[31]
                    rowShop.col33 = row[32]
                    try:
                        rowShop.col34 = row[33]
                    except:
                        pass
                    try:
                        rowShop.col35 = row[34]
                    except:
                        pass
                    try:
                        rowShop.col36 = row[35]
                    except:
                        pass
                    try:
                        rowShop.col37 = row[36]
                    except:
                        pass
                    try:
                        rowShop.col38 = row[37]
                    except:
                        pass
                    try:
                        rowShop.col39 = row[38]
                    except:
                        pass
                    try:
                        rowShop.col40 = row[39]
                    except:
                        pass
                    try:
                        rowShop.col41 = row[40]
                    except:
                        pass
                    try:
                        rowShop.col42 = row[41]
                    except:
                        pass
                    try:
                        rowShop.col43 = row[42]
                    except:
                        pass
                    try:
                        rowShop.col44 = row[43]
                    except:
                        pass
                    try:
                        rowShop.col45 = row[44]
                    except:
                        pass
                    try:
                        rowShop.col46 = row[45]
                    except:
                        pass
                    try:
                        rowShop.col47 = row[46]
                    except:
                        pass
                    try:
                        rowShop.col48 = row[47]
                    except:
                        pass
                    try:
                        rowShop.col49 = row[48]
                    except:
                        pass
                    try:
                        rowShop.col50 = row[49]
                    except:
                        pass
                    try:
                        rowShop.col51 = row[50]
                    except:
                        pass
                    try:
                        rowShop.col52 = row[51]
                    except:
                        pass
                    try:
                        rowShop.col53 = row[52]
                    except:
                        pass
                    try:
                        rowShop.col54 = row[53]
                    except:
                        pass
                    try:
                        rowShop.col55 = row[54]
                    except:
                        pass
                    try:
                        rowShop.col56 = row[55]
                    except:
                        pass
                    try:
                        rowShop.col57 = row[56]
                    except:
                        pass
                    try:
                        rowShop.col58 = row[57]
                    except:
                        pass
                    try:
                        rowShop.col59 = row[58]
                    except:
                        pass
                    try:
                        rowShop.col60 = row[59]
                    except:
                        pass
                    try:
                        rowShop.col61 = row[60]
                    except:
                        pass
                    try:
                        rowShop.col62 = row[61]
                    except:
                        pass
                    try:
                        rowShop.col63 = row[62]
                    except:
                        pass
                    try:
                        rowShop.col64 = row[63]
                    except:
                        pass
                    try:
                        rowShop.col65 = row[64]
                    except:
                        pass
                    try:
                        rowShop.col66 = row[65]
                    except:
                        pass
                    try:
                        rowShop.col67 = row[66]
                    except:
                        pass
                    try:
                        rowShop.col68 = row[67]
                    except:
                        pass
                    try:
                        rowShop.col69 = row[68]
                    except:
                        pass
                    try:
                        rowShop.col70 = row[69]
                    except:
                        pass
                    try:
                        rowShop.col71 = row[70]
                    except:
                        pass
                    try:
                        rowShop.col72 = row[71]
                    except:
                        pass
                    try:
                        rowShop.col73 = row[72]
                    except:
                        pass
                    try:
                        rowShop.col74 = row[73]
                    except:
                        pass
                    try:
                        rowShop.col75 = row[74]
                    except:
                        pass
                    try:
                        rowShop.col76 = row[75]
                    except:
                        pass
                    try:
                        rowShop.col77 = row[76]
                    except:
                        pass
                    try:
                        rowShop.col78 = row[77]
                    except:
                        pass
                    try:
                        rowShop.col79 = row[78]
                    except:
                        pass
                    try:
                        rowShop.col80 = row[79]
                    except:
                        pass
                    try:
                        rowShop.col81 = row[80]
                    except:
                        pass
                    try:
                        rowShop.col82 = row[81]
                    except:
                        pass
                    try:
                        rowShop.col83 = row[82]
                    except:
                        pass
                    try:
                        rowShop.col84 = row[83]
                    except:
                        pass
                    try:
                        rowShop.col85 = row[84]
                    except:
                        pass
                    try:
                        rowShop.col86 = row[85]
                    except:
                        pass
                    try:
                        rowShop.col87 = row[86]
                    except:
                        pass
                    rowShop.save()
    return JsonResponse('OK', safe=False)

def eshop_get_id(request):
    eid = request.GET['id'];
    try:
        rowShop = Eshop.objects.filter(edit = False).get(id = eid)
    except ObjectDoesNotExist:
        return JsonResponse({'error': True, 'message': "ObjectDoesNotExist"}, safe=False)
    return JsonResponse({'error': False, 'message': rowShop.col1, 'name': rowShop.col2}, safe=False)


@csrf_exempt
def eshop_set_description(request):
    eid = request.POST.get('id', '')
    text = request.POST.get('text', '')
    try:
        rowShop = Eshop.objects.get(id = eid)
    except ObjectDoesNotExist:
        return JsonResponse({'error': True, 'message': "ObjectDoesNotExist"}, safe=False)
    else:
        rowShop.col4 = text
        rowShop.edit = True
        rowShop.save()
    return JsonResponse({'error': False, 'message': 'ok'}, safe=False)


def eshop_json(request):
    result_list = []
    designer = Eshop.objects.all();
    #.filter(id__lte=18900)
    designer = designer.filter(newcol0 = True)#filter(edit = True).exclude(newcol=None)
    designer = designer.distinct()
    [result_list.append(r.as_dict()) for r in designer]
    result_dict = {
        'draw': 1,
        'totalRecords': len(result_list),
        'filteredRecords': len(result_list),
        'data': result_list
    }
    return JsonResponse(result_dict, safe=False)

def eshop_table(request):
    args = {}
    return render_to_response('eshop_table.html', args)

def eshop_csv(request):
    result_list = []
    designer = Eshop.objects.filter(edit=True).exclude(newcol=None)
    if 1 == 2:
        logging.basicConfig(level = True)
        for r in designer:
            logging.debug( u'r: %s ', r.id)
            r.edit = False
            r.save()
        return JsonResponse("ok1", safe=False)
    for r in designer:
        p = []
        p.append(r.col1)
        p.append(r.col2)
        p.append(r.col3)
        try:
            newcol = r.newcol+"<br>"+r.col4;
        except:
            newcol = r.col4;
        finally:
            p.append(newcol)
        p.append(r.col5)
        p.append(r.col6)
        p.append(r.col7)
        p.append(r.col8)
        p.append(r.col9)
        p.append(r.col10)
        p.append(r.col11)
        p.append(r.col12)
        p.append(r.col13)
        p.append(r.col14)
        p.append(r.col15)
        p.append(r.col16)
        p.append(r.col17)
        p.append(r.col18)
        p.append(r.col19)
        p.append(r.col20)
        p.append(r.col21)
        p.append(r.col22)
        p.append(r.col23)
        p.append(r.col24)
        p.append(r.col25)
        p.append(r.col26)
        p.append(r.col27)
        p.append(r.col28)
        p.append(r.col29)
        p.append(r.col30)
        p.append(r.col31)
        p.append(r.col32)
        p.append(r.col33)
        if r.col34 != None:
            p.append(r.col34)
        if r.col35 != None:
            p.append(r.col35)
        if r.col36 != None:
            p.append(r.col36)
        if r.col37 != None:
            p.append(r.col37)
        if r.col38 != None:
            p.append(r.col38)
        if r.col39 != None:
            p.append(r.col39)
        if r.col40 != None:
            p.append(r.col40)
        if r.col41 != None:
            p.append(r.col41)
        if r.col42 != None:
            p.append(r.col42)
        if r.col43 != None:
            p.append(r.col43)
        if r.col44 != None:
            p.append(r.col44)
        if r.col45 != None:
            p.append(r.col45)
        if r.col46 != None:
            p.append(r.col46)
        if r.col47 != None:
            p.append(r.col47)
        if r.col48 != None:
            p.append(r.col48)
        if r.col49 != None:
            p.append(r.col49)
        if r.col50 != None:
            p.append(r.col50)
        if r.col51 != None:
            p.append(r.col51)
        if r.col52 != None:
            p.append(r.col52)
        if r.col53 != None:
            p.append(r.col53)
        if r.col54 != None:
            p.append(r.col54)
        if r.col55 != None:
            p.append(r.col55)
        if r.col56 != None:
            p.append(r.col56)
        if r.col57 != None:
            p.append(r.col57)
        if r.col58 != None:
            p.append(r.col58)
        if r.col59 != None:
            p.append(r.col59)
        if r.col60 != None:
            p.append(r.col60)
        if r.col61 != None:
            p.append(r.col61)
        if r.col62 != None:
            p.append(r.col62)
        if r.col63 != None:
            p.append(r.col63)
        if r.col64 != None:
            p.append(r.col64)
        if r.col65 != None:
            p.append(r.col65)
        if r.col66 != None:
            p.append(r.col66)
        if r.col67 != None:
            p.append(r.col67)
        if r.col68 != None:
            p.append(r.col68)
        if r.col69 != None:
            p.append(r.col69)
        if r.col70 != None:
            p.append(r.col70)
        if r.col71 != None:
            p.append(r.col71)
        if r.col72 != None:
            p.append(r.col72)
        if r.col73 != None:
            p.append(r.col73)
        if r.col74 != None:
            p.append(r.col74)
        if r.col75 != None:
            p.append(r.col75)
        if r.col76 != None:
            p.append(r.col76)
        if r.col77 != None:
            p.append(r.col77)
        if r.col78 != None:
            p.append(r.col78)
        if r.col79 != None:
            p.append(r.col79)
        if r.col80 != None:
            p.append(r.col80)
        if r.col81 != None:
            p.append(r.col81)
        if r.col82 != None:
            p.append(r.col82)
        if r.col83 != None:
            p.append(r.col83)
        if r.col84 != None:
            p.append(r.col84)
        if r.col85 != None:
            p.append(r.col85)
        if r.col86 != None:
            p.append(r.col86)
        if r.col87 != None:
            p.append(r.col87)
        result_list.append(p)
    sheetx = {
        "Export Products Sheet": result_list
    }
    save_data(BASE_DIR+'\static\export0.xlsx', sheetx)
    return JsonResponse("ok", safe=False)



def set_myremont(request):
    name = request.GET['name']
    site = request.GET['site']
    phone = request.GET['phone']
    category = request.GET['category']
    city = request.GET['city']
    try:
        parce = Myremont.objects.filter(type_q = "new1").get(site=site)
    except ObjectDoesNotExist:
        parce = Myremont.objects.create(
            name = name,
            site = site,
            phone = phone,
            category = category,
            city = city,
            type_q = "new1",
        )
        parce.save()
    else:
        parce.name = name
        parce.site = site
        parce.phone = phone
        parce.category = category
        parce.city = city
        parce.type_q = "new1"
        parce.save()
        return JsonResponse('Duplicate', safe=False)
    return JsonResponse('OK', safe=False)


def myremont_json(request):
    result_list = []
    designer = Myremont.objects.all();
    designer = designer.filter(type_q = "new1");
    [result_list.append(r.as_dict()) for r in designer]
    result_dict = {
        'draw': 1,
        'totalRecords': len(result_list),
        'filteredRecords': len(result_list),
        'data': result_list
    }
    return JsonResponse(result_dict, safe=False)

def myremont(request):
    args = {}
    return render_to_response('myremont.html', args)


def watch_img_get(request):
    args = {}
    data = get_data(BASE_DIR+'\static\img_klatch.xlsx') #static\watch_photo_22_03_2018.xlsx
    #jdata = json.dumps(data['Лист1'])
    for row in data['img_klatch']:
        try:
            rowShop = Watch.objects.get(img_name = row[0])
        except ObjectDoesNotExist:
            if 1 == 1:
                rowShop = Watch.objects.create(
                    img_name = row[0]
                )
                a0 = row[0];
                a1 = row[1];
                rowShop.url = row[1]
                rowShop.name = row[0].split('.')[0].split('(')[0]
                rowShop.img_id = row[1].split('=')[0].split('/0/d/')[1]
                rowShop.filter = "new_05_04_2018" # new_klatch_28_03_2018
                rowShop.save()
        except:
            pass
    return JsonResponse('OK', safe=False)


def watch_img_table(request):
    args = {}
    return render_to_response('watch_img_table.html', args)

def watch_img_json(request):
    result_list = []
    designer = Watch.objects.all();
    designer = designer.filter(filter="new_05_04_2018") #new_watch_22_03_2018
    #.filter(id__lte=18900)
    designer = designer.distinct()
    [result_list.append(r.as_dict()) for r in designer]
    result_dict = {
        'draw': 1,
        'totalRecords': len(result_list),
        'filteredRecords': len(result_list),
        'data': result_list
    }
    return JsonResponse(result_dict, safe=False)


def parce1_get(request):
    args = {}
    data = get_data(BASE_DIR+'\static\ex3.xlsx')
    attrList = ['Механизм','Материал корпуса','Материал ремешка','Водонепроницаемость','Функции День недели','Функции Дата','Функции Секундомер',
        'Стекло', 'Функции Подсветка','Размеры','Толщина','Длина ремешка','Застежка']
    n1 =0;
    n2 =0;
    n3 =0;
    n4 =0;
    n5 =0;
    s1 =0;
    #jdata = json.dumps(data['Лист1'])
    for row in data['Часы наручные']:
        n1+=1
        if len(row) < 5:
            continue
        try:
            s5 = row[1]
            print("s5",row[1])
            rowShop = WatchPrice.objects.filter(type_data="new_24_04_2018").get(sku=row[1])
        except ObjectDoesNotExist:
            n4+=1
            if row[1] == 'Код' or row[1] =="":
                continue
            n5+=1
            print(row[1])
            print('!n1='+str(n1)+" n2="+str(n2))
            a1 = row[1]
            a2 = row[2]
            a3 = row[3]
            if (type(row[3]) != float and type(row[3]) != int):
                s1+=1;
                print('!n1=',n1,'s1=',s1," Row3=",row[3],"type",str(type(row[3])))
            if (type(row[3]) == float or type(row[3]) == int) and row[3] > 9 and len(row[2]) > 3:
                n2+=1
                print('n1=',n1," n2=",n2)
                rowShop = WatchPrice.objects.create(
                    sku = row[1],
                    price = row[3],
                )
                rowShop.type_data = "new_24_04_2018"
                rowShop.new_watch = True
                rowShop.name = row[2]
                rowShop.url_img_price = row[6]
                img_str = "";
                try:
                    imgs = Watch.objects.filter(name__contains = row[1])
                except ObjectDoesNotExist:
                    for i in imgs:
                        if i != imgs[0]:
                            img_str +=", "
                        img_str += "https://drive.google.com/uc?export=download&confirm=no_antivirus&id="+i.img_id
                rowShop.url_imgs = img_str
                for x in range(10, len(row)):
                    if (x-10) < len(attrList):
                        if len(row[x]) > 3:
                            watchattr = PriceAttr.objects.create(
                                name = attrList[x-10],
                                value = row[x],
                            )
                            watchattr.save()
                            rowShop.attributes.add(watchattr)
                rowShop.save()
        else:
            n3+=1;
    print('n1=',n1," n2=",n2," n3=",n3," n4=",n4," n5=",n5,'s1=',s1)
    return JsonResponse('OK', safe=False)

def parce1_set(request):
    args = {}
    data = get_data(BASE_DIR+'\static\ex4.xlsx')
    attrList = ['Механизм','Материал корпуса','Материал ремешка','Водонепроницаемость','Функции День недели','Функции Дата','Функции Секундомер',
        'Стекло', 'Функции Подсветка','Размеры','Толщина','Длина ремешка','Застежка']
    n1 =0;
    n2 =0;
    #jdata = json.dumps(data['Лист1'])
    for row in data['Export Products Sheet']:
        n1+=1
        if len(row) < 5:
            continue
        try:
            rowShop = WatchPrice.objects.filter(type_data="new_24_04_2018").get(sku=row[0])
        except ObjectDoesNotExist:
            pass
        else:
            n2+=1
            row[8] = rowShop.price
    save_data(BASE_DIR+'\static\ex5.xlsx', data)
    return JsonResponse('OK', safe=False)

def parce2_get(request):
    args = {}
    data = get_data(BASE_DIR+'\static\ex05042018.xlsx')
    attrList = ['Механизм','Материал корпуса','Материал ремешка','Водонепроницаемость','Функции День недели','Функции Дата','Функции Секундомер',
        'Стекло', 'Функции Подсветка','Размеры','Толщина','Длина ремешка','Застежка']
    n1 =0;
    n2 =0;
    #jdata = json.dumps(data['Лист1'])
    for row in data['Export Products Sheet']:
        n1+=1
        if len(row) < 5:
            continue
        try:
            rowShop = WatchPrice.objects.filter(type_data="new_05_04_2018").get(sku = row[0])
        except ObjectDoesNotExist:
            pass
        else:
            n2+=1
            print('n1='+str(n1)+" n2="+str(n2))
            rowShop.new_watch = False
            rowShop.save()
    return JsonResponse('OK', safe=False)

def parce_klatch_get(request):
    args = {}
    data = get_data(BASE_DIR+'\static\import21032018.xlsx')
    attrList = ['Длина', 'Ширина', 'Толщина']

    #jdata = json.dumps(data['Лист1'])
    for row in data['Клатчи']:
        if len(row) < 5:
            continue
        try:
            rowShop = WatchPrice.objects.get(sku = row[1])
        except ObjectDoesNotExist:
            if row[1] == 'Код':
                continue
            a1 = row[1]
            a2 = row[2]
            a3 = row[3]
            if type(row[3]) == float and row[3] > 6 and len(row[2]) > 3:
                rowShop = WatchPrice.objects.create(
                    sku = row[1],
                    price = row[3],
                )
                rowShop.type_data = "new_27_03_2018_klatch"
                rowShop.name = row[2]
                #rowShop.url_img_price = row[6]
                img_str = "";
                try:
                    imgs = Watch.objects.filter(name__contains = row[1])
                except ObjectDoesNotExist:
                    for i in imgs:
                        if i != imgs[0]:
                            img_str +=", "
                        img_str += "https://drive.google.com/uc?export=download&confirm=no_antivirus&id="+i.img_id
                rowShop.url_imgs = img_str
                for x in range(7, len(row)):
                    if (x-7) < len(attrList):
                        if len(row[x]) > 3:
                            watchattr = PriceAttr.objects.create(
                                name = attrList[x-7],
                                value = row[x],
                            )
                            watchattr.save()
                            rowShop.attributes.add(watchattr)
                rowShop.save()
    return JsonResponse('OK', safe=False)

def parce1_del_get(request):
    args = {}
    data = get_data(BASE_DIR+'\static\import21032018.xlsx')
    attrList = ['Механизм','Материал корпуса','Материал ремешка','Водонепроницаемость','Функции День недели','Функции Дата','Функции Секундомер',
        'Стекло', 'Функции Подсветка','Размеры','Толщина','Длина ремешка','Застежка']

    #jdata = json.dumps(data['Лист1'])
    for row in data['Убыло из наличия']:
        if len(row) < 5:
            continue
        try:
            rowShop = WatchPrice.objects.get(sku = row[1])
        except ObjectDoesNotExist:
            pass
        else:
            rowShop.del_data = True
            rowShop.type_data = "del_21_03_2018"
            rowShop.save()
    return JsonResponse('OK', safe=False)

def parce1_table(request):
    args = {}
    return render_to_response('parce1_table.html', args)

def parce_klatch_table(request):
    args = {}
    return render_to_response('parce_klatch_table.html', args)


def parce1_json(request):
    result_list = []
    designer = WatchPrice.objects.all();
    #.filter(id__lte=18900)
    #designer = designer.filter(new_watch=True)
    designer = designer.filter(type_data="new_24_04_2018")
    #designer = designer.filter(new_watch=True)
    #designer = designer.filter(type_data="del_21_03_2018")
    designer = designer.distinct()
    [result_list.append(r.as_dict()) for r in designer]
    result_dict = {
        'draw': 1,
        'totalRecords': len(result_list),
        'filteredRecords': len(result_list),
        'data': result_list
    }
    return JsonResponse(result_dict, safe=False)

def kovale_xml(request):
    print ("respData")
    url1 = 'http://kovale.com.ua/extension/sync/upload/files/all_products.xml'
    url2 = BASE_DIR + '\\static\\x1.xml'
    print (url2)
    table = '</br><table class="table" style="text-align: center;"><thead style="background: #e2e2e2;"><tr><th style="text-align: center;">&nbsp;</th><th style="text-align: center;">Размер</th><th style="text-align: center;">Грудь(см)</th><th style="text-align: center;">Талия(см)</th><th style="text-align: center;">Бедра(см)</th></tr></thead><tbody><tr><td rowspan="5"style="transform: rotate(-90deg); vertical-align: inherit;">Норма</td><td>40</td><td>80</td><td>56</td><td>84</td></tr><tr><td>42</td><td>84</td><td>60</td><td>88</td></tr><tr><td>44</td><td>88</td><td>64</td><td>92</td></tr><tr><td>46</td><td>92</td><td>68</td><td>96</td></tr><tr><td>48</td><td>96</td><td>72</td><td>100</td></tr><tr><td rowspan="4"style="transform: rotate(-90deg); vertical-align: inherit;">Батал/1</td><td>50</td><td>100</td><td>77</td><td>108</td></tr><tr><td>52</td><td>104</td><td>82</td><td>112</td></tr><tr><td>54</td><td>108</td><td>87</td><td>116</td></tr><tr><td>56</td><td>112</td><td>92</td><td>120</td></tr><tr><td rowspan="4"style="transform: rotate(-90deg); vertical-align: inherit;">Батал/2</td><td>58</td><td>118</td><td>97</td><td>126</td></tr><tr><td>60</td><td>124</td><td>103</td><td>132</td></tr><tr><td>62</td><td>130</td><td>109</td><td>138</td></tr><tr><td>64</td><td>136</td><td>115</td><td>144</td></tr></tbody></table>'
    file1 = urllib.request.urlopen(url1)
    data = file1.read()
    file1.close()
    try:
        pass
    except:
        pass

    tree = ET.parse(url2)
    #tree = ET.ElementTree(data.decode("utf-8"))
    #root = ET.fromstring(data.decode("utf-8"))
    #ET.parse(feed)
    print ("Download ok")
    root = tree.getroot()
    print (1,root[0].text)
    for a in root[0]:
        print (3,a,a.text)
    print (2,root[0].find("categories"))
    event = root[0].find("offers").findall("offer")
    #for i in range(4):
    for e in event:
        #виключаэм товар наложка
        if(e.find('vendorCode').text == 'KA-1500'):
            root[0].find("offers").remove(e)
            continue
        print ("e",e,e.find('price').text)
        if(float(e.find('price').text) < 1001):
            e.find('price').text = str(float(e.find('price').text) + 100)
        else:
            e.find('price').text = str(float(e.find('price').text) * 1.2)
        if(e.find('description') == None):
            desc = ET.fromstring("<description></description>")
            desc.text = table
            e.insert(4,desc)
            #print ("e.id", e.id)
        else:
            e.find('description').text = e.find('description').text + table
    try:
        pass
    except:
        print ("Unexpected error opening :")
        return JsonResponse("Unexpected error opening", safe=False)
    else:
        print ("else else else")
    xml_str = ET.tostring(root, encoding='utf8', method='xml')
    return HttpResponse(xml_str,  content_type='text/xml')
    return JsonResponse("ok", safe=False)



def watch_clear(request):
    args = {}
    data = get_data(BASE_DIR+'\static\ex_23_03_2018.xlsx')
    attrList = ['Механизм','Материал корпуса','Материал ремешка','Водонепроницаемость','Функции День недели','Функции Дата','Функции Секундомер',
        'Стекло', 'Функции Подсветка','Размеры','Толщина','Длина ремешка','Застежка']

    #jdata = json.dumps(data['Лист1'])
    row =data['Export Products Sheet'];
    len_row = len(row)
    i=0;
    while i < len_row-1:
        i+=1;
        if len(row[i]) < 5:
            continue
        if row[i][15] == "https://prom.ua/Kvartsevye-naruchnye-chasy":
            if row[i][0] == row[i+1][0]:
                row.pop(i)
                len_row-=1;
                i-=1;
    save_data(BASE_DIR+'\static\exp_23_03_2018.xlsx', data)
    return JsonResponse('OK', safe=False)


keyWordsList = {
#Косметички
'00710':'Косметички,Косметические наборы,Косметички жіночі,Косметички большие,Косметички в подарок,Косметички в дорогу,Косметички в украине,Косметички для дівчаток,косметички для подростков,Косметичка женская,Косметички недорого,Косметички на 8 марта,Косметички недорогие,косметички пром,косметички с зеркалом',
#Подставки и держатели
"00712":'Подставки и держатели,Универсальная подставка,Универсальная подставка для гаджетов,Держатели для телефона,Держатели для гаджетов',
#Фляги
"00785":"Фляги,Подарочные фляги,Фляги для води,фляги для алкоголя,Фляги в подарок,Фляга,Фляги на 23 февраля,Интересные фляги,Прикольня фляга",
#Аксессуары к телефонам и планшетам
"00787":"Аксессуары к телефонам и планшетам,Аксессуары к мобильным телефонам,Аксессуары к китайским телефонам,Аксессуары к сотовым телефонам,Аксессуары к графическим планшетам,Аксессуары к планшету",
#Рюкзаки
"007135":"Рюкзаки,Рюкзаки жіночі,Рюкзаки чоловічі,Рюкзаки для дівчат,Рюкзаки туристические,Рюкзаки для підлітків,Рюкзаки для дітей,Рюкзаки для дівчаток,Рюкзаки модные,Рюкзаки модні",
#Зажимы для денег
"007137":"Зажимы для денег,Зажимы для денег украина,Зажим для денег дешевый,Зажимы для денег женские,Зажим для денег и кредитных карт,зажим для грошей,зажим для денег хороший подарок,зажим для денег тонкий",
#Универсальные портативные батареи
"007137":"Универсальные портативные батареи,Power Bank,повербанк для айфона,повербанк аліекспрес,повербанк в виде игрушки,повербанк в украине,повербанк для планшета,повербанк игрушка",
#Подставки под бижутерию
"007183":"Подставки под бижутерию,оригинальные подставки под бижутерию,подставка под бижутерию украина,красивые подставки под бижутерию,подставки под бижутерию игрушки",
#Косметические зеркала
"007195":"Косметические зеркала,зеркало косметическое маленькое,косметическое зеркало без подсветки,косметическое зеркало в подарок,косметические зеркала для ванной,лучшие косметические зеркала,косметическое зеркало настенное,	косметическое зеркало на подставке",
#Винные наборы
"007210":"Винные наборы,винные наборы подарки для мужчин,винные наборы сомелье,наборы винных аксессуаров,винные подарочные наборы,винные наборы украина",
#Карнавальные головные уборы
"007277":"Карнавальные головные уборы,карнавальные головные уборы для детей,карнавальные головные уборы для взрослых,детские карнавальные головные уборы,карнавальные шляпы,карнавальные банданы",
#Органайзеры в сумку
"007224":"Органайзеры в сумку,органайзер в сумку для мамы,органайзер в дамскую сумку,органайзер в женскую сумку.органайзер в сумку мужской,органайзер в сумку в украине",
#Кожаные Браслеты
"007271":"Кожаные Браслеты,кожаные браслеты украина,кожаные браслеты для влюбленных,мужские кожаные браслеты,кожаные браслеты для пар,кожаные браслеты для девушек,	кожаные женские браслеты на руку,кожаный браслет лента,лучшие кожаные браслеты.кожаные браслеты парные",
#Соломенные шляпы
"007296":"Соломенные шляпы,соломенные шляпы мужские,соломенные шляпы украина,соломенные шляпы женские,соломенные шляпы для детей,соломенные шляпы дешево,соломенная шляпа для мальчика,соломенная шляпа лето",
#Органайзеры для путешествий
"007305":"Органайзеры для путешествий,органайзеры для путешествий украина,органайзер для документов,органайзер для путешествий киев",
#Все для Дома
#Шкатулки для украшений
"00716":"Шкатулки для украшений,шкатулки для украшений недорого,шкатулка для украшений большая,шкатулки для украшений детские,шкатулка для украшений дешево,женские шкатулки для украшений,шкатулки и подставки для украшений,шкатулка для украшений пром",
#Светильники и ночники
"00719":"Светильники и ночники,светильники ночники для детей,необычные светильники и ночники,светильник ночник для детской,светильник ночник звездное небо,светильник-ночник игра света,светильники ночники украина",
#Оригинальные Будильники
"00720":"Оригинальные будильники,необычные будильники,оригинальные детские будильники,будильники не ной,будильник вставай,будильники громкие,будильники детские,жесткие будильники,лучшие будильники",
#Все для Кухни
"00722":"Все для Кухни,все для кухни украина,все для кухни дешево,все для кухни недорого",
#Фоторамки
"00775":"Фоторамки,фоторамки на стіну,фоторамки дитячі,фоторамки в интерьере,фоторамки детские,фоторамки недорогие",
#Все для Ванны
"00776":"Все для Ванны,все для ванны украина,все для ванной комнаты,все для ванной дешево,все для ванных кімнат",
#Органайзеры для вещей и обуви
"00777":"Органайзеры для вещей и обуви,органайзер для одежды и обуви,кофры и органайзеры для одежды и обуви,органайзеры для хранения вещей,органайзер для зимней обуви,органайзер для взуття,органайзер для хранения обуви",
#Подушки интерьерные
"00791":"Подушки интерьерные,интерьерные подушки декорирование,интерьерные подушки украина,интерьерные подушки игрушки",
#Оригинальные чашки и кружки
"07108":"Оригинальные чашки и кружки,оригинальные чашки для мужчин,оригинальная чашка,оригинальные чашки в подарок,оригинальные чашки для чая,оригинальные кофейные чашки,самые оригинальные чашки,оригинальные чайные кружки",
#Книги Сейф
"007120":"Книги сейф,книга сейф большая,книга сейф дешево,книга сейф маленькая,книга с сейфом,книга шкатулка сейф",
#Ключницы
"007122":"Ключницы,ключницы настенные,ключницы для дома,ключницы в подарок,ключницы для ключей,ключницы женские,ключницы закрытые,ключницы на стену,ключницы открытые,ключницы оригинальные",
#Фотоальбомы
"007124":"Фотоальбомы,фотоальбомы украина,фотоальбомы большие,фотоальбомы выпускные,фотоальбомы влюбленных,фотоальбом в садик,фотоальбомы для детского сада,фотоальбомы для школьников,фотоальбом египет,фотоальбомы женщин,фотоальбомы и фотокниги,фотоальбомы к юбилею,фотоальбом лета,фотоальбомы свадебные",
#Солонки и перечницы
"007128":"Солонки и перечницы,оригинальные солонки и перечницы,прикольные солонки и перечницы,необычные солонки и перечницы,дизайнерские солонки и перечницы",
#Оригинальные копилки
"007130":"Оригинальные копилки,копилки для детей,копилки детские,копилки для взрослых,копилки для мальчиков,копилки недорого,копилки прикольные,копилки с приколом",
#Термосы и ланч-боксы
"007132":"Термосы и ланч-боксы,термос ланч бокс для еды,термос ланч бокс вакуумный,ланч бокс для детей,термос для детей",
#Заварники для чая и кофе
"007146":"Заварники для чая и кофе,заварники кофе,большие заварники,маленькие заварники для чая,необычные заварники,оригинальные заварники для чая,прикольные заварники",
#Пледы
"007152":"Пледы,пледы детские,пледы киев,пледы больших размеров,пледы в подарок,оригинальные пледы,пледы покрывала,пледы с рукавами",
#Вакуумные пакеты
"007164":"Вакуумные пакеты,вакуумные пакеты в дорогу,вакуумные пакеты киев",
#Термокружки
"007165":"Термокружки,термокружки в украине,термокружки для двоих,термокружки детские,термокружки для девушек,термокружки оригинальыне,термокружки парные,термокружки с приколом",
#Подарочные свечи
"007203":"Подарочные свечи,свечи подарочные украина,подарочные декоративные свечи,красивые свечи,подарочные наборы свечей",
#Зеркала
"007205":"Зеркала,зеркала в интерьере,зеркала в ванную комнату,зеркала в спальню",
#Формы для льда
"007218":"Формы для льда,формы для льда шар,формы для льда большие,формы для льда кубики,формы для льда дешево,форма для заморозки льда,оригинальные формы для льда,формочки для льда",
#Кухонные таймеры
"007244":"Кухонные таймеры,кухонные часы и таймеры,кухонный таймер обратного отсчета,Кухонные таймеры оригинальыне",
#Кисточки и Лопатки
"007248":"Кисточки и Лопатки,кисточка для кухни,лопатка для кухни",
#Кухонные принадлежности
"007268":"Кухонные принадлежности,кухонные принадлежности пром,кухонные принадлежности в украине,кухонные аксессуары,кухонные принадлежности для повара,забавные кухонные принадлежности",
#Кухонный текстиль
"007285":"Кухонный текстиль,кухонный текстиль украина,текстиль в кухню",
#Ванные принадлежности
"007289":"Ванные принадлежности,аксесуари для ванної кімнати,",
#Контейнеры для хранения продуктов
"007302":"Контейнеры для хранения продуктов,большие контейнеры для хранения продуктов,вакуумные контейнеры для хранения продуктов,контейнеры для хранения пищевых продуктов",
#Формы для яиц
"007318":"Формы для яиц,оригинальные Формы для яиц,формы для яиц пашот,формы для жарки яиц,формы для варки яиц,детские формы для яиц,форма для запекания яиц",
#Крючки-вешалки для одежды
"007347":"Крючки-вешалки для одежды,крючки для одежды,дизайнерские крючки для одежды,необычные крючки для одежды,крючок для одежды одинарный,крючок для одежды тройной,вешалки для одежды детские",
#Измерительные Приборы
"007351":"Измерительные приборы,Измерительные приборы кухонные,измерительные приборы украина",
#Стаканы
"007368":"Стаканы,стаканы для латте,стаканы для виски,стаканы для кофе,стаканы в машину,",
#Оригинальные подарки
#Магнитные досточки
"00770":"Магнитные досточки,магнитные досточки для рисования,магнитные доски на холодильник,большие магнитные доски,магнитные досточки детские",
#Магниты на холодильник
"007116":"Магниты на холодильник,магниты на холодильник для детей,магниты на холодильник большие,магниты на холодильник для пар,магниты на холодильник с приколами",
#Умный пластилин Хендгам
"007129":"Умный пластилин,хендгам,handgum,хендгам масса для лепки",
#Прикольные подарки
"007138":"Прикольные подарки,прикольные подарки на 8 марта,прикольные подарки на день влюбленных,прикольные подарки айтишникам,прикольные подарки в украине,прикольные подарки для девушек,прикольные подарки любимой",
#Наборы по уходу за обувью
"007154":"Наборы по уходу за обувью,набор по уходу за обувью киев,набор по уходу за обувью для мужчин,мини набор по уходу за обувью,набор средств по уходу за обувью",
#Чашки Starbucks
"007156":"Чашки Starbucks,чашка starbucks киев,термочашка starbucks украина",
#Скретч-карты мира
"007159":"Скретч-карты мира,подарочные скретч-карты мира,скретч карта мира карта туриста",
#Прикольные фартуки
"007170":"Прикольные фартуки,прикольные фартуки для женщин,прикольные фартуки для мужчин,прикольные фартуки для молодоженов,оригиналбный фартук",
#Подарочные наборы
"007172":"Подарочные наборы,подарочные наборы для мужчин,подарочные наборы для женщин,подарочные наборы киев,набор в подарок",
#Медали и кубки
"007182":"Медали и кубки,кубки и медали в украине,медали кубки статуэтки,сувенирные медали и кубки,спортивные медали и кубки",
#Оригинальные тарелки
"007190":"Оригинальные тарелки,оригинальные тарелки для еды,оригинальные настенные тарелки,оригинальные тарелки киев",
#Подарки для взрослых
"007208":"Подарки для взрослых,подарки для взрослых украина,подарки для взрослых 18+,подарки для пар",
#Чашки хамелеон
"007220":"Чашки хамелеон,чашки хамелеон украина,оригинальная чашка хамелеон",
#Подарочные пакеты
"007230":"Подарочные пакеты,подарочные пакеты с рисунком,подарочные пакеты детские",
#Карнавальные маски
"007255":"Карнавальные маски,карнавальные маски для мужчин,карнавальные маски на утреник,карнавальные маски для женщин,карнавальные маски детские",
#Прикольные тапки
"007266":"Прикольные тапки,прикольные тапки мужские,тапочки для мужчин прикольные,прикольные тапочки в подарок,комнатные тапочки прикольные,прикольные тапочки домашние,тапочки с приколом",
#Шлемы для пива
"007272":"Шлемы для пива,шлем для любителей пива,шлем с банками для пива,шлем с трубочками для пива,шлем с подставками для пива,шлем пивной на матч",
#Подарочные рюмки и бокалы
"007301":"Подарочные рюмки и бокалы,подарочные наборы рюмок,подарочный набор бокалов",
#Карнавальные костюмы для взрослых
"007328":"Карнавальные костюмы для взрослых,новогодние костюмы для взрослых,карнавальные костюмы для взрослых женские",
#Маскарадные крылья
"007337":"Маскарадные крылья,карнавальные крылья ангела,карнавальные крылья феи,карнавальные аксесуары",
#Часы в Обратную сторону
"007346":"Часы в обратную сторону,часы идущие в обратную сторону,часы в другую сторону,стрелки часов в обратную сторону,часы которые идут в обратную сторону",
#Подарочные коробки
"007370":"Подарочные коробки,подарочные коробки для мужчин,подарочные коробки для детей,подарочные коробки дизайнирские",
#Именные подарки
"007372":"Именные подарки,именные подарки девушке,именные подарки для мужчин,именные подарки для детей,именной подарок любимому,именные подарки на свадьбу,именной подарок подруге",
#Печенье с предсказаниями
'007237':'Печенье с предсказаниями,пожелания в печенье с предсказаниями,оригинальное печенье с предсказаниями',
#Здоровье и Туризм
#тут пару груп пропустив занадто загальны назви
#Водонепроницаемые чехлы
"007126":"Водонепроницаемые чехлы,водонепроницаемые чехлы на телефон,водонепроницаемые чехлы для айфона,водонепроницаемый чехол в украине",
#Маски для сна
"007265":"Маски для сна,маски для сна для детей,удобная маска для сна,маска для сна на глаза",
#Бутылочки для воды
"007313":"Бутылочки для воды,бутылочки для воды детские,бутылочки для воды спортивные,бутылочки для воды в школу,бутылка для воды модная,бутылка для воды школьнику",
#Надувные кресла - лежаки
"007314":"Надувные кресла лежаки,надувные кресла детские,надувное пляжное кресло,надувное кресло релакс,надувные лежаки для пляжа,надувной мешок лежак",
#Термобутылки Swell
"007316":"Термобутылки Swell,термобутылки для детей,термобутылки брендовые,детские термобутылочки,термобутылка киев",
#Антистресс
"007365":"Антистресс,антистресс игрушки,антистресс для рук,антистресс для мужчин,антистресс іграшка,антистресс для женщин",
#Маникюрные Наборы
"007371":"Маникюрные Наборы,маникюрные наборы бренды,маникюрный набор для мужчин,маникюрный набор для детей.маникюрный набор для дизайна ногтей,маникюрный набор женский,маникюрный набор хороший",
#Все для детей
#Жвачки Love is
"00711":"Жвачки Love is,жвачки love is киев,жвачка love is подарок",
#Интерактивные игрушки
"00713":"Интерактивные игрушки,интерактивные игрушки украина,интерактивные игрушки для мальчика,интерактивные игрушки для детей",
#Детская посуда
"007139":"Детская посуда,детская посуда в садик,детская посуда в дорогу,детская посуда для праздника,детская посуда для самых маленьких",
#Детские карнавальные костюмы
"007256":"Детские карнавальные костюмы,детские карнавальные костюмы в украине,детские карнавальные костюмы для мальчиков,детские новогодние костюмы",
#Кинетический песок
"007303":"Кинетический песок,кинетический песок в украине, оригинальынй подарок кинетический песок,кинетический песок для моторики",
#Детские карнавальные маски
"007336":"Детские карнавальные маски,детские карнавальные маски животных,новогодние детские маски",
#Канцелярия и Блокноты
#Веселая канцелярия
"00782":"Веселая канцелярия,веселая канцелярия киев,прикольная канцелярия",
#Блокноты
"007356":"Блокноты,блокноты большие,блокноты в украине,блокноты для девушек,блокноты для мужчин",
#цифровые товари
"1902":"самые популярные цифровые товары,самые продаваемые цифровые товары,офисные програмы,антивирусы,для работы с видео,для работы со звуком,Office,офис для дома,Windows 10,навигатор",
#Игрушки
#6+8 4+5 0+3
"584":"Деревяные игрушки,развивающие игрушки,игрушка для малыша,для развития моторики",
"585":"Деревяные игрушки,развивающие игрушки,игрушка для малыша,для развития моторики",
"586":"Деревяные игрушки,развивающие игрушки,игрушка для малыша,для развития моторики",
#Детская одежда
#Спортивные костюмы для мальчиков
"623":"Спортивные костюмы для мальчиков,спортивные костюмы фото,спортивные костюмы для детей,спортивный костюм детский",
#Верхняя одежда для мальчиков
"624":"Верхняя одежда для мальчиков,верхняя одежда для подростков,верхняя одежда для сына",
#Верхняя одежда для девочек
"625":"Верхняя одежда для девочек,верхняя одежда для подростков,верхняя одежда для дочки",
#Головные уборы для детей
"627":"Головные уборы для детей,головные уборы детские на лето,головные уборы для внука",
#Головные уборы для малышей
"628":"Головные уборы для малышей,головные уборы малишам на лето",
#Детские новогодние костюмы
"629":"Детские новогодние костюмы,детские карнавальные костюмы фото,карнавальный костюм на мальчика,карнавальный костюм на девочку",
#Пинетки для девочки
"630":"Пинетки для девочки,пинетки детские",
#Пинетки для мальчика
"631":"Пинетки для мальчика,пинетки детские",
#Летние комплекты для мальчиков
"632":"Летние комплекты для мальчиков,Летние комплекты для пацана,Летние комплекты для подростка",
#Одежда для девочек
"633":"Одежда для девочек,Одежда для пацанки,Одежда для подростка",
}


def forus_xml(request):
    print ("forus_xml")
    dh = request.GET.get("dohod");
    url1 = 'http://forus.com.ua/vugruzka/forus_opt_prom.xml'
    #url2 = BASE_DIR + '\\static\\x2.xml'
    #print (url2)
    file1 = urllib.request.urlopen(url1)
    data = file1.read()
    file1.close()
    try:
        pass
    except:
        pass
    #tree = ET.parse(url2)
    #tree = ET.ElementTree(data.decode("utf-8"))
    root = ET.fromstring(data)#.encode("utf-8")
    #ET.parse(feed)
    print ("Download ok")
    #root = tree.getroot()
    print (1,root[0].text)
    print (2,"categories",root[0].find("categories"))
    nc=0;
    for c in root[0].find("categories"):
        nc+=1;
        print (nc,"categori=",c.text)
    #event = root[0].find("offers").findall("offer")
    event = root[0].find("offers").findall("item")
    #for i in range(4):
    print ("test 0")
    for e in event:
        #виключаэм товар наложка
        po = e.find('price_optovikam').text
        if(po in ("",None)):
            root[0].find("offers").remove(e)
            continue
        #print ('no continue',e.find('price_optovikam').text,e.find('vendorCode').text)
        #print ("e",e,e.find('price').text)
        e.remove(e.find('price_optovikam'))
        e.attrib['selling_type'] = 'r';
        e.find('price').text = e.find('price').text.split('.')[0].split(',')[0][:-1]+"0";
        dohod = float(e.find('price').text.replace(',','.')) - float(po.replace(',','.'));
        if(dohod < 50):
            root[0].find("offers").remove(e);
            continue
        if(dh):
            e.find('price').text = e.find('price').text +" dohod="+str(dohod)
        categoryId = e.find('categoryId').text;
        if(categoryId in keyWordsList.keys()):
            keywords = ET.fromstring("<keywords></keywords>")
            keywords.text = str(e.find('name').text)+","+keyWordsList[categoryId];
            e.insert(4,keywords)
        if(e.find('description') == None):
            desc = ET.fromstring("<description></description>")
            #desc.text = table
            e.append(desc)
            #print ("e.id", e.id)
        #else:
        #e.find('description').text = e.find('description').text + table
    try:
        pass
    except:
        print ("Unexpected error opening :")
        return JsonResponse("Unexpected error opening", safe=False)
    else:
        print ("good end")
    xml_str = ET.tostring(root, encoding='utf8', method='xml')
    return HttpResponse(xml_str,  content_type='text/xml')
    return JsonResponse("ok", safe=False)


def tr_igruski(request):
    print("tradeevo igruski xml")
    dh = request.GET.get("dohod");
    url1 = 'https://partner.tradeevo.com/api/PromProductListXml?id=cacb98c1-8504-4d00-917c-ab8af00ddec3&list=55'
    #url2 = BASE_DIR + '\\static\\x2.xml'
    #print (url2)
    file1 = urllib.request.urlopen(url1)
    data = file1.read()
    file1.close()
    try:
        pass
    except:
        pass
    #tree = ET.parse(url2)
    #tree = ET.ElementTree(data.decode("utf-8"))
    root = ET.fromstring(data)#.encode("utf-8")
    #ET.parse(feed)
    print ("Download ok")
    #root = tree.getroot()
    print (2,"categories",root.find("catalog"))
    nc=0;
    for c in root.find("catalog"):
        nc+=1;
        print (nc,"categori=",c.text)
    #event = root[0].find("offers").findall("offer")
    event = root.find("items").findall("item")
    #for i in range(4):
    print ("test 0")
    for e in event:
        po = e.find('price').text
        #виключаэм товар наложка
        if(po in ("",None)):
            root.find("items").remove(e)
            continue
        #print ('no continue',e.find('price_optovikam').text,e.find('vendorCode').text)
        #print ("e",e,e.find('price').text)
        e.attrib['selling_type'] = 'r';
        dohod = round(float(str(float(e.find('price').text) * 1.4).split('.')[0].split(',')[0][:-1]+"0") - float(e.find('price').text), 2);
        if(dohod < 50):
            dohod = round(float(str(float(e.find('price').text) + 50).split('.')[0].split(',')[0][:-1]+"0") - float(e.find('price').text), 2);
            e.find('price').text = str(float(e.find('price').text) + 50).split('.')[0].split(',')[0][:-1]+"0";
        else:
            e.find('price').text = str(float(e.find('price').text) * 1.4).split('.')[0].split(',')[0][:-1]+"0";
        if(dh):
            e.find('price').text = e.find('price').text +" dohod="+str(dohod)
        categoryId = e.find('categoryId').text;
        if(categoryId in keyWordsList.keys()):
            keywords = ET.fromstring("<keywords></keywords>")
            if(e.find('keywords') != None):
                keywords = e.find('keywords')
            keywords.text = keywords.text+", "+str(e.find('name').text)+", "+keyWordsList[categoryId];
            if(e.find('keywords') == None):
                e.append(keywords)
        if(e.find('description') == None):
            desc = ET.fromstring("<description></description>")
            if(e.find('name') != null):
                desc.text = e.find('name').text
                print('desc.text',desc.text)
            #desc.text = table
            e.append(desc)
    try:
        pass
    except:
        print ("Unexpected error opening :")
        return JsonResponse("Unexpected error opening", safe=False)
    else:
        print ("good end")
    xml_str = ET.tostring(root, encoding='utf8', method='xml')
    return HttpResponse(xml_str,  content_type='text/xml')
    return JsonResponse("ok", safe=False)

def findList(lst, key, value):
    for i, dic in enumerate(lst):
        if dic[key] == value:
            return i
    return -1

def tr_child_clothes(request):
    dh = request.GET.get("dohod");
    procentPlus = float(request.GET.get("procentPlus", 1.15));
    min_price = float(request.GET.get("min_price", 40));
    url = "https://partner.tradeevo.com/api/PromProductListXml?id=cacb98c1-8504-4d00-917c-ab8af00ddec3&list=60";
    Tr = tr_get_xml(url, procentPlus,min_price, dh)
    xml_str = ET.tostring(Tr, encoding='utf8', method='xml')
    return HttpResponse(xml_str,  content_type='text/xml')

def tr_child_igruski(request):
    dh = request.GET.get("dohod");
    procentPlus = float(request.GET.get("procentPlus", 1.4));
    min_price = float(request.GET.get("min_price", 50));
    url = "https://partner.tradeevo.com/api/PromProductListXml?id=cacb98c1-8504-4d00-917c-ab8af00ddec3&list=55";
    Tr = tr_get_xml(url, procentPlus,min_price, dh, "igruski 111")
    xml_str = ET.tostring(Tr, encoding='utf8', method='xml')
    return HttpResponse(xml_str,  content_type='text/xml')

def tr_cufrovi(request):
    dh = request.GET.get("dohod");
    procentPlus = float(request.GET.get("procentPlus", 1.19));
    min_price = float(request.GET.get("min_price", 50));
    url = "https://partner.tradeevo.com/api/PromProductListXml?id=cacb98c1-8504-4d00-917c-ab8af00ddec3&list=77";
    Tr = tr_get_xml(url, procentPlus,min_price, dh, "цифрові товари 61")
    xml_str = ET.tostring(Tr, encoding='utf8', method='xml')
    return HttpResponse(xml_str,  content_type='text/xml')

def tr_bags(request):
    dh = request.GET.get("dohod");
    procentPlus = float(request.GET.get("procentPlus", 1.22));
    min_price = float(request.GET.get("min_price", 50));
    url = "https://partner.tradeevo.com/api/PromProductListXml?id=cacb98c1-8504-4d00-917c-ab8af00ddec3&list=96";
    Tr = tr_get_xml(url, procentPlus,min_price, dh, "сумки 111")
    xml_str = ET.tostring(Tr, encoding='utf8', method='xml')
    return HttpResponse(xml_str,  content_type='text/xml')

def all_in_xml(request):
    print ("forus_xml")
    dh = request.GET.get("dohod");
    url1 = 'https://serene-plains-87737.herokuapp.com/forus_xml'#'http://127.0.0.1:8000/forus_xml'#
    UrlList = [];
    url2 = 'https://partner.tradeevo.com/api/PromProductListXml?id=cacb98c1-8504-4d00-917c-ab8af00ddec3&list=55'#'http://127.0.0.1:8000/tr_child_igruski'
    url3 = "https://partner.tradeevo.com/api/PromProductListXml?id=cacb98c1-8504-4d00-917c-ab8af00ddec3&list=60"; # http://127.0.0.1:8000/tr_child_clothes?dohod=on&procentPlus=1.15&min_price=50
    url4 = "https://partner.tradeevo.com/api/PromProductListXml?id=cacb98c1-8504-4d00-917c-ab8af00ddec3&list=77"; # http://127.0.0.1:8000/tr_cufrovi?dohod=on&procentPlus=1.19&min_price=50
    url5 = "https://partner.tradeevo.com/api/PromProductListXml?id=cacb98c1-8504-4d00-917c-ab8af00ddec3&list=96"; # http://127.0.0.1:8000/tr_bags?dohod=on&procentPlus=1.2&min_price=50
    if dh:
        url1 += "?dohod="+dh
    TrRoot = [];
    UrlItem = {}
    UrlItem['url'] = url2
    UrlItem['name'] = "igruski 111"
    UrlItem['procentPlus'] = 1.4
    UrlItem['min_price'] = 50
    TrRoot.append(UrlItem)
    UrlList.append(UrlItem['url'])
    UrlItem = {}
    UrlItem['url'] = url3
    UrlItem['name'] = "detka odesda 180"
    UrlItem['procentPlus'] = 1.15
    UrlItem['min_price'] = 40
    TrRoot.append(UrlItem)
    UrlList.append(UrlItem['url'])
    UrlItem = {}
    UrlItem['url'] = url4
    UrlItem['name'] = "цифрові товари 61"
    UrlItem['procentPlus'] = 1.19
    UrlItem['min_price'] = 50
    TrRoot.append(UrlItem)
    UrlList.append(UrlItem['url'])
    UrlItem = {}
    UrlItem['url'] = url5
    UrlItem['name'] = "сумки 111"
    UrlItem['procentPlus'] = 1.22
    UrlItem['min_price'] = 50
    TrRoot.append(UrlItem)
    UrlList.append(UrlItem['url'])
    #грузим основний хмл
    file1 = urllib.request.urlopen(url1)
    data = file1.read()
    file1.close()
    #грузим хмл трайдево
    root = ET.fromstring(data.decode("utf-8"))#.encode("utf-8")
    categories = root[0].find("categories");
    nc=0;
    categoriList = [];
    for c in categories:
        categoriList.append(c.attrib['id'])
        nc+=1;
        print (nc,"categori=",c.text)
    event = root[0].find("offers").findall("item")
    try:
        pass
    except:
        pass
    for url in UrlList:
        Tr=0;
        item = findList(TrRoot,'url',url);
        if  item > -1:
            Tr = tr_get_xml(url, TrRoot[item]['procentPlus'],TrRoot[item]['min_price'], dh,TrRoot[item]['name'])
        else:
            file2 = urllib.request.urlopen(url)
            data2 = file2.read()
            file2.close()
            #tree = ET.parse(url2)
            #tree = ET.ElementTree(data.decode("utf-8"))
            Tr = ET.fromstring(data2.decode("utf-8")) #tradeevo
        #ET.parse(feed)
        print ("Download ok")
        print ("tr0",Tr[0])
        print ("catalog",Tr[0].find("catalog"))
            #root = tree.getroot()
        TrCategories = Tr.find("catalog");
        TrExludeCatagory = []
        for c in TrCategories:
            if(c.attrib['id'] not in categoriList and c.attrib['id'] != '1'):
                categoriList.append(c.attrib['id'])
                categories.append(c)
                nc+=1;
                print (nc,"categori=",c.text)
            else:
                existCategory = root[0].find("categories category[id='"+ c.attrib['id'] +"']")
                if(existCategory != None and existCategory != c.text):
                    TrExludeCatagory.append(c.attrib['id'])
        #event = root[0].find("offers").findall("offer")
        #for i in range(4):
        print ("test ",len(event))
        itm = len(event);
        itemList = []
        for e in event:
            itemList.append(e.attrib['id'])
        TrItem = Tr.find("items").findall("item")
        for e in TrItem:
            if(e.attrib['id'] not in itemList):
                #виключаэм товар наложка
                po = e.find('price').text
                if(po in ("",None)):
                    continue
                if(e.find('description') == None):
                    desc = ET.fromstring("<description></description>")
                    if(e.find('name') != null):
                        desc.text = e.find('name').text
                    e.append(desc)
                #print ('no continue',e.find('price_optovikam').text,e.find('vendorCode').text)
                #print ("e",e,e.find('price').text)
                e.attrib['selling_type'] = 'r';
                categoryId = e.find('categoryId').text;
                if(categoryId in TrExludeCatagory):
                    e.find('categoryId').text = "";
                itemList.append(e.attrib['id'])
                root[0].find("offers").append(e)
                itm += 1;
                print('itm ', itm, e.attrib['id'])
    try:
        pass
    except:
        print ("Unexpected error opening :")
        return JsonResponse("Unexpected error opening", safe=False)
    else:
        print ("good end")
    print("enddata ",len(root[0].find("offers").findall("item")))
    xml_str = ET.tostring(root, encoding='utf8', method='xml')
    return HttpResponse(xml_str,  content_type='text/xml')
    return JsonResponse("ok", safe=False)

def xstr(s):
    if s is None or len(s) == 1:
        return ''
    else:
        return s

def tr_get_xml(url, procentPlus = 1.4,min_price = 50, dohod = False, nameUrl =""):
    dh = dohod;
    file1 = urllib.request.urlopen(url)
    data = file1.read()
    file1.close()
    try:
        pass
    except:
        pass
    #tree = ET.parse(url2)
    #tree = ET.ElementTree(data.decode("utf-8"))
    root = ET.fromstring(data)#.encode("utf-8")
    #ET.parse(feed)
    print ("Download ok")
    #root = tree.getroot()
    print (2,"categories",root.find("catalog"))
    nc=0;
    for c in root.find("catalog"):
        nc+=1;
        print (nc,"categori=",c.text)
    #event = root[0].find("offers").findall("offer")
    event = root.find("items").findall("item")
    #for i in range(4):
    print ("test 0")
    for e in event:
        po = e.find('price').text
        #виключаэм товар наложка
        if(po in ("",None)):
            root.find("items").remove(e)
            continue
        #print ('no continue',e.find('price_optovikam').text,e.find('vendorCode').text)
        #print ("e",e,e.find('price').text)
        e.attrib['selling_type'] = 'r';
        dohod = round(float(str(float(e.find('price').text) * procentPlus).split('.')[0].split(',')[0][:-1]+"0") - float(e.find('price').text), 2);
        if(dohod < min_price):
            #dohod = round(float(str(float(e.find('price').text) + min_price).split('.')[0].split(',')[0][:-1]+"0") - float(e.find('price').text), 2);
            #e.find('price').text = str(float(e.find('price').text) + min_price).split('.')[0].split(',')[0][:-1]+"0";
            root.find("items").remove(e)
        else:
            e.find('price').text = str(float(e.find('price').text) * procentPlus).split('.')[0].split(',')[0][:-1]+"0";
        if(dh):
            e.find('price').text = e.find('price').text +" dohod="+str(dohod)
        categoryId = e.find('categoryId').text;
        if(categoryId in keyWordsList.keys()):
            keywords = ET.fromstring("<keywords></keywords>")
            if(e.find('keywords') != None):
                keywords = e.find('keywords')
            keywords.text = xstr(xstr(keywords.text)+",")+xstr(e.find('name').text)+","+keyWordsList[categoryId];
            if(e.find('keywords') == None):
                e.append(keywords)
        #print('description')
        #print(e.find('description').text)
        if(e.find('description') == None or e.find('description').text == None):
            desc = e.find('description');
            if(e.find('description') == None):
                desc = ET.fromstring("<description></description>")
            if(e.find('name') != None):
                desc.text = e.find('name').text
            if(nameUrl == "igruski 111"):
                desc.text += '<br> Большой выбор детских деревянных игрушек для вашего малыша. Чтобы малыш в любую минуту имел возможность себя занять купите ему интересные деревяные игрушки которые  дают возможность познать окружающий мир, быть здоровым и развиваться в гармонии.<br> Игрушки, которые изготовлены из дерева, пропитаны положительной энергией природы и теплом'
            #desc.text = table
            if(e.find('description') == None):
                e.append(desc)
    try:
        pass
    except:
        print ("Unexpected error opening :")
        #return JsonResponse("Unexpected error opening", safe=False)
    else:
        print ("good end")
    return root
