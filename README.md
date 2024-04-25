# IMATTC
[Ingress任务创作工具](https://mission-author-dot-betaspike.appspot.com/)脚本的全面升级。

想要使用它，您需要在浏览器中安装[Tampermonkey](https://tampermonkey.net/)插件。此外，您还需要一个拥有创建任务资格的[Ingress](https://ingress.com/)账户。

==>> [安装此脚本](https://github.com/adinlead/IMATTC/raw/master/IMATTC.user.js) <<==

**IMATTC 目前尚不支持 Greasemonkey。** 建议您目前使用Tampermonkey。如果您有使用Greasemonkey编写脚本的经验，[我（原作者）非常乐意接受帮助来完善这一功能]((https://github.com/andyjennings314/IMATTC/issues/9))。

## 入门指南

安装IMATTC后，您首次加载任务编辑器时，会发现所有任务均按字母顺序排列。
![alt text](https://github.com/andyjennings314/IMATTC/raw/master/img/screen1.PNG "Screenshot 1")

您可以像这样轻松地使用任务编辑器（只需点击“编辑任务”按钮即可调用），但您可能还想使用分类功能将任务按照横幅或其他方式分组。首先，点击“新建分类”按钮，并选择一个名称：
![alt text](https://github.com/andyjennings314/IMATTC/raw/master/img/screen2.PNG "Screenshot 2")

脚本将创建新分类，并自动将您的其他任务放入“未分类”任务中。下一步是将任务添加到您的分类中，在脚本的最新版本中，这一操作变得非常简单——只需点击并拖动您想要的任务到相应的分类中！您甚至可以通过点击和拖动来重新排序它们在分类中的默认顺序。
![alt text](https://github.com/andyjennings314/IMATTC/raw/master/img/screen5.PNG "Screenshot 5")

最后，每个分类的顶部都有一组按钮，用于预览其内容的横幅效果或组内任务路径：
![alt text](https://github.com/andyjennings314/IMATTC/raw/master/img/screen6.PNG "Screenshot 6")

## 功能特性
- 对主要任务列表的全面改进，特点如下：
  - 更有效地利用屏幕空间
  - 更鲜明的色彩和图标表示任务状态
  - 一致的任务排序标准，包括用户自定义标准
  - 可在任务编辑器和Ingress Intel地图上预览任务
  - 用户自定义任务分类，包括图像和路线预览功能，以及拖放式任务排序和重新排序。
- 在路点视图中拖放式路点重新排序
- 对任务创建/编辑界面的细微用户界面改进


## 咕咕咕
- 导出 [IngressMosaik](https://ingressmosaik.com) 功能
- 附加任务的排序标准
- 搜索任务

## Release History
- 1.7.0: Enabled drag-and-drop moving of missions between categories
- 1.6.0: Enabled waypoint reordering on Waypoint view.
- 1.5.4: Enabled exporting and importing category data. Ability to categorise missions from Preview Mission step.
- 1.4.0: Added ability to preview route of missions in category, including distance and duration.
- 1.3.0: Added ability to preview missions using mission editor. Laid groundwork for previewing banner routes. Refactored overall mission status counts
- 1.2.0: Added sorting criteria for categories, uncategorised, and all-when-there's-no-categories
- 1.1.0: Refactored how categories are stored on the client side, to prepare for sorting and drag/drop
- 1.0.0: Some CSS changes, attempt to solve issues with Greasemonkey.
- 0.4.4: "Preview as banner" button for categories. Missions that are live contain a link to the mission in the Intel map.
- 0.4.3: Fixed transition while loading in reworked pages. Mission backgrounds now dark grey, former background colours moved to mission borders. Assorted CSS fixes.
- 0.4.2: Implemented custom category feature - user can create custom categories, and add missions to them.
- 0.3.5: Mission actions check appropriate actions exist. Overhaul on Mission Type and Mission Name pages for better layout.
- 0.3.4: Preparation for beta testing. Page changes now check variable for page load to confirm page transition. Adding better breadcrumb to Edit Mission pages. Added warning about Any Order missions when selected as Mission Type. Better handing for mission images. CSS fixes.
- 0.3.3: All mission action buttons now match mission status colour schemes. Mission type on overview page now uses glyphicons.
- 0.3.1 - 0.3.2: Mission details table border colours and some mission action button colours now match mission status colour schemes.
- 0.2.2: Init() now runs on $routeChangeStart attached to rootScope, removed custom header element.
- 0.2.1: Header element now runs init() to reload mission overview. Better script load fail message.
- pre-0.2.1: Check commits on GitHub for more information.
