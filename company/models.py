from django.db import models

# Create your models here.

class Houzz(models.Model):
    class Meta:
        db_table = 'parce_houzz'
    name = models.CharField(max_length=90, null=True, blank=True)
    phone = models.CharField(max_length=90, null=True, blank=True)
    site = models.CharField(max_length=255, null=True, blank=True)
    siteUrl = models.CharField(max_length=255, null=True, blank=True)
    oblast = models.CharField(max_length=90, null=True, blank=True)

    def as_dict(self):
        return dict(
            id=self.id,
            name=self.name,
            phone=self.phone,
            site=self.site,
            siteUrl=self.siteUrl,
            oblast=self.oblast
        )


class Eshop(models.Model):
    class Meta:
        db_table = 'parce_eshop'
    newcol = models.CharField(max_length=250, null=True, blank=True)
    newedit = models.BooleanField(default=False, blank=True)
    newcol0 = models.BooleanField(default=False, blank=True)
    col1 = models.CharField(max_length=250, null=True, blank=True)
    col2 = models.CharField(max_length=250, null=True, blank=True)
    col3 = models.CharField(max_length=250, null=True, blank=True)
    col4 = models.TextField(null=True, blank=True)
    col5 = models.CharField(max_length=250, null=True, blank=True)
    col6 = models.CharField(max_length=250, null=True, blank=True)
    col7 = models.CharField(max_length=250, null=True, blank=True)
    col8 = models.CharField(max_length=250, null=True, blank=True)
    col9 = models.CharField(max_length=250, null=True, blank=True)
    col10 = models.CharField(max_length=250, null=True, blank=True)
    col11 = models.CharField(max_length=250, null=True, blank=True)
    col12 = models.CharField(max_length=250, null=True, blank=True)
    col13 = models.CharField(max_length=250, null=True, blank=True)
    col14 = models.CharField(max_length=250, null=True, blank=True)
    col15 = models.CharField(max_length=250, null=True, blank=True)
    col16 = models.CharField(max_length=250, null=True, blank=True)
    col17 = models.CharField(max_length=250, null=True, blank=True)
    col18 = models.CharField(max_length=250, null=True, blank=True)
    col19 = models.CharField(max_length=250, null=True, blank=True)
    col20 = models.CharField(max_length=250, null=True, blank=True)
    col21 = models.CharField(max_length=250, null=True, blank=True)
    col22 = models.CharField(max_length=250, null=True, blank=True)
    col23 = models.CharField(max_length=250, null=True, blank=True)
    col24 = models.CharField(max_length=250, null=True, blank=True)
    col25 = models.CharField(max_length=250, null=True, blank=True)
    col26 = models.CharField(max_length=250, null=True, blank=True)
    col27 = models.CharField(max_length=250, null=True, blank=True)
    col28 = models.CharField(max_length=250, null=True, blank=True)
    col29 = models.CharField(max_length=250, null=True, blank=True)
    col30 = models.CharField(max_length=250, null=True, blank=True)
    col31 = models.CharField(max_length=250, null=True, blank=True)
    col32 = models.CharField(max_length=250, null=True, blank=True)
    col33 = models.CharField(max_length=250, null=True, blank=True)
    col34 = models.CharField(max_length=250, null=True, blank=True)
    col35 = models.CharField(max_length=250, null=True, blank=True)
    col36 = models.CharField(max_length=250, null=True, blank=True)
    col37 = models.CharField(max_length=250, null=True, blank=True)
    col38 = models.CharField(max_length=250, null=True, blank=True)
    col39 = models.CharField(max_length=250, null=True, blank=True)
    col40 = models.CharField(max_length=250, null=True, blank=True)
    col41 = models.CharField(max_length=250, null=True, blank=True)
    col42 = models.CharField(max_length=250, null=True, blank=True)
    col43 = models.CharField(max_length=250, null=True, blank=True)
    col44 = models.CharField(max_length=250, null=True, blank=True)
    col45 = models.CharField(max_length=250, null=True, blank=True)
    col46 = models.CharField(max_length=250, null=True, blank=True)
    col47 = models.CharField(max_length=250, null=True, blank=True)
    col48 = models.CharField(max_length=250, null=True, blank=True)
    col49 = models.CharField(max_length=250, null=True, blank=True)
    col50 = models.CharField(max_length=250, null=True, blank=True)
    col51 = models.CharField(max_length=250, null=True, blank=True)
    col52 = models.CharField(max_length=250, null=True, blank=True)
    col53 = models.CharField(max_length=250, null=True, blank=True)
    col54 = models.CharField(max_length=250, null=True, blank=True)
    col55 = models.CharField(max_length=250, null=True, blank=True)
    col56 = models.CharField(max_length=250, null=True, blank=True)
    col57 = models.CharField(max_length=250, null=True, blank=True)
    col58 = models.CharField(max_length=250, null=True, blank=True)
    col59 = models.CharField(max_length=250, null=True, blank=True)
    col60 = models.CharField(max_length=250, null=True, blank=True)
    col61 = models.CharField(max_length=250, null=True, blank=True)
    col62 = models.CharField(max_length=250, null=True, blank=True)
    col63 = models.CharField(max_length=250, null=True, blank=True)
    col64 = models.CharField(max_length=250, null=True, blank=True)
    col65 = models.CharField(max_length=250, null=True, blank=True)
    col66 = models.CharField(max_length=250, null=True, blank=True)
    col67 = models.CharField(max_length=250, null=True, blank=True)
    col68 = models.CharField(max_length=250, null=True, blank=True)
    col69 = models.CharField(max_length=250, null=True, blank=True)
    col70 = models.CharField(max_length=250, null=True, blank=True)
    col71 = models.CharField(max_length=250, null=True, blank=True)
    col72 = models.CharField(max_length=250, null=True, blank=True)
    col73 = models.CharField(max_length=250, null=True, blank=True)
    col74 = models.CharField(max_length=250, null=True, blank=True)
    col75 = models.CharField(max_length=250, null=True, blank=True)
    col76 = models.CharField(max_length=250, null=True, blank=True)
    col77 = models.CharField(max_length=250, null=True, blank=True)
    col78 = models.CharField(max_length=250, null=True, blank=True)
    col79 = models.CharField(max_length=250, null=True, blank=True)
    col80 = models.CharField(max_length=250, null=True, blank=True)
    col81 = models.CharField(max_length=250, null=True, blank=True)
    col82 = models.CharField(max_length=250, null=True, blank=True)
    col83 = models.CharField(max_length=250, null=True, blank=True)
    col84 = models.CharField(max_length=250, null=True, blank=True)
    col85 = models.CharField(max_length=250, null=True, blank=True)
    col86 = models.CharField(max_length=250, null=True, blank=True)
    col87 = models.CharField(max_length=250, null=True, blank=True)
    edit = models.BooleanField(default=False, blank=True)

    def as_dict(self):
        return dict(
            id=self.id,
            newcol=self.newcol,
            edit=self.edit,
            col1=self.col1,
            col2=self.col2,
            col3=self.col3,
            col4=self.col4,
            col5=self.col5,
            col6=self.col6,
            col7=self.col7,
            col8=self.col8,
            col9=self.col9,
            col10=self.col10,
            col11=self.col11,
            col12=self.col12,
            col13=self.col13,
            col14=self.col14,
            col15=self.col15,
            col16=self.col16,
            col17=self.col17,
            col18=self.col18,
            col19=self.col19,
            col20=self.col20,
            col21=self.col21,
            col22=self.col22,
            col23=self.col23,
            col24=self.col24,
            col25=self.col25,
            col26=self.col26,
            col27=self.col27,
            col28=self.col28,
            col29=self.col29,
            col30=self.col30,
            col31=self.col31,
            col32=self.col32,
            col33=self.col33,
            col34=self.col34,
            col35=self.col35,
            col36=self.col36,
            col37=self.col37,
            col38=self.col38,
            col39=self.col39,
            col40=self.col40,
            col41=self.col41,
            col42=self.col42,
            col43=self.col43,
            col44=self.col44,
            col45=self.col45,
            col46=self.col46,
            col47=self.col47,
            col48=self.col48,
            col49=self.col49,
            col50=self.col50,
            col51=self.col51,
            col52=self.col52,
            col53=self.col53,
            col54=self.col54,
            col55=self.col55,
            col56=self.col56,
            col57=self.col57,
            col58=self.col58,
            col59=self.col59,
            col60=self.col60,
            col61=self.col61,
            col62=self.col62,
            col63=self.col63,
            col64=self.col64,
            col65=self.col65,
            col66=self.col66,
            col67=self.col67,
            col68=self.col68,
            col69=self.col69,
            col70=self.col70,
            col71=self.col71,
            col72=self.col72,
            col73=self.col73,
            col74=self.col74,
            col75=self.col75,
            col76=self.col76,
            col77=self.col77,
            col78=self.col78,
            col79=self.col79,
            col80=self.col80,
            col81=self.col81,
            col82=self.col82,
            col83=self.col83,
            col84=self.col84,
            col85=self.col85,
            col86=self.col86,
            col87=self.col87
        )


class Myremont(models.Model):
    class Meta:
        db_table = 'parce_myremont'
    name = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=90, null=True, blank=True)
    site = models.CharField(max_length=255, null=True, blank=True)
    category = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=90, null=True, blank=True)
    type_q = models.CharField(max_length=90, null=True, blank=True)

    def as_dict(self):
        return dict(
            id=self.id,
            name=self.name,
            phone=self.phone,
            site=self.site,
            category=self.category,
            city=self.city
        )


class Watch(models.Model):
    class Meta:
        db_table = 'img_watch'
    name = models.CharField(max_length=255, null=True, blank=True)
    img_name = models.CharField(max_length=255, null=True, blank=True)
    url = models.CharField(max_length=90, null=True, blank=True)
    img_id = models.CharField(max_length=255, null=True, blank=True)
    filter = models.CharField(max_length=255, null=True, blank=True)

    def as_dict(self):
        return dict(
            id=self.id,
            name=self.name,
            img_name=self.img_name,
            url=self.url,
            img_id=self.img_id,
            filter=self.filter,
        )
class PriceAttr(models.Model):
    class Meta:
        db_table = 'price_attr'
    name = models.CharField(max_length=255, null=True, blank=True)
    value = models.CharField(max_length=255, null=True, blank=True)

    def as_dict(self):
        return dict(
            name=self.name,
            value=self.value,
        )

from operator import attrgetter


class WatchPrice(models.Model):
    class Meta:
        db_table = 'watch_price'
    sku = models.CharField(max_length=255, null=True, blank=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    price = models.DecimalField(max_digits=45, decimal_places=2)
    url_img_price = models.CharField(max_length=255, null=True, blank=True)
    url_imgs = models.CharField(max_length=255, null=True, blank=True)
    attributes = models.ManyToManyField(PriceAttr, related_name='group_clients')
    new_watch = models.BooleanField(default=False, blank=True)
    del_data = models.BooleanField(default=False, blank=True)
    type_data = models.CharField(max_length=255, null=True, blank=True)

    def as_dict(self):
        attr = {}
        for r in self.attributes.all():
            attr[r.name] = r.value
        img_str=""
        try:
            imgs = Watch.objects.filter(name__contains = self.sku).order_by('img_name')
        except ObjectDoesNotExist:
            pass
        else:
            res = False
            resBig = False
            for i in imgs:
                if i.img_name == self.sku+".jpg" or i.img_name == self.sku+".JPG":
                    if i.img_name == self.sku+".JPG":
                        resBig = True
                    res = True
                    i.img_name = self.sku+"(1).jpg"
                    i.save()
                if i != imgs[0]:
                    img_str +=", "
                img_str += "https://drive.google.com/uc?export=download&confirm=no_antivirus&id="+i.img_id# +" !"+i.img_name+"!"
            if res:
                img_str=""
                imgs = imgs.order_by('img_name')
                for i in imgs:
                    if i != imgs[0]:
                        img_str +=", "
                    img_str += "https://drive.google.com/uc?export=download&confirm=no_antivirus&id="+i.img_id# +" !"+i.img_name+"!"+resBig
        if not img_str:
            pass
            #return False
        #[attr.append(r.as_dict()) for r in self.attributes.all()]
        return dict(
            id=self.id,
            sku=self.sku,
            name=self.name,
            price=self.price,
            url_img_price=self.url_img_price,
            url_imgs=img_str,
            attr=attr,
            type_data=self.type_data,
        )
