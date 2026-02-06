---
title: Hello Revit打印视图的研究
data: 2025-7-27 20:42:01
tags:
  - Revit
---
# Revit打印视图的研究

PostScript自定义页面大小，页面位置：从角部偏移：无页边距，缩放：缩放，缩放比：50%

此时，pdf视图的（可预览）左下角是视Outline的左下角。

● 在打印“沃尔玛”的平面图时（空间尺寸是别墅的30倍），发现以上设置打印出的整个平面pdf居然是A4大小，经过计算，实际缩放比是1000左右，而非预设的200。

关于“缩放50%”且默认“PostScript”（即A4）但又没自定义“PostScript"尺寸时，实际缩放比并不是200的BUG:

BUG原因，代码未能正确保存对打印设置的修改，已经修复。但是PostScript尺寸也是一种固定的纸质大小。

解决办法一：读取包围盒框大小，用边界尺寸来设置PostScript的自定义纸张大小；(走不通， 没找到如何更改Revit的某个打印机的PostScript的纸张大小，这个PostScript纸张大小在Window设置中的值和在各个软件中的值不一样）

且纸张最大尺寸是5080mm×5080mm，假设比例尺是默认的1:100,那么最大支持的包围框大小是：508米×508米。

解决办法二：读取包围盒大小，纸张选一个，例如A0，选择“匹配页面”，如果宽度更长，那么就是“宽度”匹配了当前纸张的宽度；如果长度更长，那么就是“长度”匹配了当前纸张大小的长度，这样就能算出实际的缩放比，但是这种实现方式不好的地方是常常有大量的页面空白

，但后续可以通过动态设置纸张方向等方式进一步优化。 √

解决办法三：根据包围盒大小，修改缩放比

有

● 关于打印机设置无法正确生效

[https://forums.autodesk.com/t5/revit-api-forum/printermanager-printsetup-do-not-apply-settings/td-p/3676618](https://forums.autodesk.com/t5/revit-api-forum/printermanager-printsetup-do-not-apply-settings/td-p/3676618)

其实是需要 printManager.PrintSetup.Save();

● 给出的Z值要修正为楼层平面的剖切高度

因为楼层平面的CropBox的Z值是没有意义的（都是-0.1 ~ -1000 feet），

所以读取CropBox的左下角点作为Origin时就要进行修正

然后立面是肯定贴不到墙面上的，所以不考虑。

最后是剖面，剖面的CropBox居然不是剪裁盒

● 楼层平面视图的剖切高度获取方法：

```
                var planViewRange = (view as ViewPlan).GetViewRange();                var floorPlanLevel = rvtDoc.GetElement(planViewRange.GetLevelId(PlanViewPlane.CutPlane)) as Level;                double offset = planViewRange.GetOffset(PlanViewPlane.CutPlane);                double cutPlaneZValue = floorPlanLevel.Elevation + offset;
```

● 视图-“剪裁注释”：

只对全部都在剖切框外的注释图元有作用。例如轴网一部分延伸到剖切框外，则其不会被部分剪裁掉。也就是说实际上这个选项影响的是注释图元的可见性，最小单位是图元。

可以通过选中剪裁框-右键-“将剪裁重设为视图范围”来实现让剪裁框扩大到包含所有可见图元（包括注释图元）。剖面没有这个选项。

● 非平面视图的CropBox的Transform并非单位矩阵，带旋转角度的；

● 平面视图的CropBox的Z值没有意义