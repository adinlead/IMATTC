// ==UserScript==
// @name         IMATTC
// @version      1.8.3
// @description  A usability overhaul for the Ingress Mission Authoring Tool
// @author       @Chyld314
// @editor       @adinlead
// @match        http://missions.ingress.com/
// @match        http://missions.ingress.com/edit*
// @match        https://missions.ingress.com/
// @match        https://missions.ingress.com/edit*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @grant        none
// @downloadURL	 https://github.com/adinlead/IMATTC/raw/master/IMATTC.user.js
// @updateURL	 https://github.com/adinlead/IMATTC/raw/master/IMATTC.user.js
// ==/UserScript==
var requiredVersion = "";  // 所需的jQuery版本
var currentVersion = $.fn.jquery;  // 当前加载的jQuery版本

if (!$ || $.fn.jquery < "3.0.0") {
    var insertJq = document.createElement('script');
    insertJq.setAttribute("type", "text/javascript");
    insertJq.setAttribute("src", "https://code.jquery.com/jquery-3.6.0.min.js");
    insertJq.setAttribute("src", "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js");
    document.getElementsByTagName("head")[0].appendChild(insertJq);
    console.log("!NO $")
}

String.prototype.format = function () {
    if (arguments.length == 0) {
        return this;
    }
    for (var s = this, i = 0; i < arguments.length; i++) {
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    }
    return s;
};

const deepAssign = function (...param) {
    let result = Object.assign({}, ...param);
    for (let item of param) {
        for (let [idx, val] of Object.entries(item)) {
            if (typeof val === 'object') {
                result[idx] = deepAssign(result[idx], val);
            }
        }
    }
    return result;
}

const _DEFAULT_LOCAL_TXT = {
    "TOP_BTN": {
        "CREATE_NEW_MISSION": "Create New Mission",
        "CREATE_NEW_CATEGORY": "Create New Category",
        "EXPORT_CATEGORY_DATA": "Export Category Data",
        "IMPORT_CATEGORY_DATA": "Import Category Data",
    },
    "PERFORM_MISSION_ACTION": "Perform Mission Action",
    "REMOVE_FROM_CATEGORY": "Remove From Category",
    "ADD_TO_CATEGORY": "Add To Category...",
    "UNSORTED_MISSIONS": "Unsorted Missions",
    "MISSION_COUNT": {
        "MISSIONS_REMAINING": "{0} missions remaining",
        "UNDER_REVIEW": "{0} under review",
        "UNPUBLISHED_DRAFTS": "{0} unpublished drafts",
        "BEING_AMENDED": "{0} being amended",
        "CHANGES_UNDER_REVIEW": "{0} changes under review",
        "PUBLISHED": "{0} published",
    },
    "GENERATE_SORT": {
        "INITIAL": "Initial",
        "ALPHABETICAL_ASC": "Alphabetical (ascending)",
        "ALPHABETICAL_DESC": "Alphabetical (descending)",
        "CREATION_ORDER": "Creation order",
        "MISSION_STATE": "Mission state",
    },
    "CATEGORY_OPT": {
        "PREVIEW_IMAGES": "Preview Images",
        "PREVIEW_ROUTE": "Preview Route",
        "DELETE_CATEGORY": "Delete Category",
    },
    "CREATE_PAGE": {
        // TOP NAV
        "MISSION_TYPE": "Mission Type",
        "MISSION_DETAILS": "Mission Details",
        "WAYPOINTS": "Waypoints",
        "PREVIEW": "Preview",
        // Mission Type Page
        "MC_TITLE": "Choose mission type:",
        "MC_SEQUENTIAL": "&nbsp;&nbsp;SEQUENTIAL",
        "MC_SEQUENTIAL_DESC": "Agents visit portals and field trip markers in a set order.<br/><br/>Best suited to missions in a banner series, or one-offs with a pre-determined route.",
        "MC_HIDDEN_SEQUENTIAL": "&nbsp;&nbsp;HIDDEN SEQUENTIAL",
        "MC_HIDDEN_SEQUENTIAL_DESC": "Agents visit portals and field trip markers in a set order, but the location of every waypoint beyond the first is hidden, meaning players rely on clues in the waypoint text.<br/><br/>Good for more puzzle-based missions, but please ensure you provide adequate clues for agents to find all the waypoints.",
        "MC_ANY_ORDER": "&nbsp;&nbsp;ANY ORDER",
        "MC_ANY_ORDER_DESC": "Agents visit portals and field trip markers in any order. Excellent for one-off missions where a specific route isn't required, but terrible for missions in banner serieses.<br /><br /><span class='stopthat'>It is strongly advised that if you are making missions for a banner, you set them as Sequential missions - your rating on IngressMosaik will thank you!",
        "MC_FOOTER_NEXT": "Mission Details >>",
        // Mission Info Page
        "MI_TITLE": "Edit mission details:",
        "MI_NAME": "Mission Name",
        "MI_NAME_PLACEHOLDER": "Add mission name",
        "MI_DESCRIPTION": "Mission Description",
        "MI_DESCRIPTION_PLACEHOLDER": "Add mission description",
        // Mission Info Page Icon Text
        "MI_ICON_LABEL": "Choose mission icon (Suggested size: 512 x 512 pixels)",
        "MI_ICON_UPLOAD_BTN": "Upload",
        "MI_ICON_CLEAR_BTN": "Clear",
        "MI_ICON_PREVIEW": "Perview",
        "MI_ICON_LOGO": "Logo",
        "MI_ICON_MEDAL": "Medal",
        // Mission Info Page Footer Btn
        "MI_FOOTER_BACK": "<< Back",
        "MI_FOOTER_NEXT": "Choose Waypoints >>",
        // Mission Waypoint Footer Btn
        "MW_FOOTER_MISSIONS": "Live Missions",
        "MW_FOOTER_BACK": "<< Back",
        "MW_FOOTER_NEXT": "Preview Mission >>",
        // Mission Perview Page
        "MF_DEFAULT_OPTIONAL": "OPTIONAL: Select a category to add this mission to",
    },
};
const _LOCAL_TXT_DICT = {
    "zh-CN": {
        "TOP_BTN": {
            "CREATE_NEW_MISSION": "新建任务",
            "CREATE_NEW_CATEGORY": "新建分类",
            "EXPORT_CATEGORY_DATA": "导出分类",
            "IMPORT_CATEGORY_DATA": "导入分类",
        },
        "PERFORM_MISSION_ACTION": "编辑任务",
        "REMOVE_FROM_CATEGORY": "移出分类",
        "ADD_TO_CATEGORY": "添加到分类",
        "UNSORTED_MISSIONS": "未分类",
        "MISSION_COUNT": {
            "MISSIONS_REMAINING": "剩余{0}个空位",
            "UNPUBLISHED_DRAFTS": "{0}个草稿",
            "UNDER_REVIEW": "{0}个审核中",
            "BEING_AMENDED": "{0}个修改中",
            "CHANGES_UNDER_REVIEW": "{0}个变更中",
            "PUBLISHED": "{0}个已发布",
        },
        "GENERATE_SORT": {
            "INITIAL": "默认",
            "ALPHABETICAL_ASC": "任务名正序",
            "ALPHABETICAL_DESC": "任务名倒序",
            "CREATION_ORDER": "创建顺序",
            "MISSION_STATE": "任务状态",
        },
        "CATEGORY_OPT": {
            "PREVIEW_IMAGES": "组图预览",
            "PREVIEW_ROUTE": "路径预览",
            "DELETE_CATEGORY": "删除分组",
        },
        "CREATE_PAGE": {
            // 顶部导航栏
            "MISSION_TYPE": "任务类型",
            "MISSION_DETAILS": "任务详情",
            "WAYPOINTS": "导航点",
            "PREVIEW": "预览",
            // 任务类型页
            "MC_TITLE": "选择任务类型：",
            "MC_SEQUENTIAL": "&nbsp;&nbsp;顺序访问",
            "MC_SEQUENTIAL_DESC": "特工按照设定的顺序访问门户和实地考察标记。<br/><br/>最适用于横幅系列中的任务，或具有预定路线的单次任务。",
            "MC_HIDDEN_SEQUENTIAL": "&nbsp;&nbsp;隐藏入口",
            "MC_HIDDEN_SEQUENTIAL_DESC": "特工按照设定的顺序访问门户和实地考察标记，但除第一个路点外，所有路点的位置都是隐藏的，这意味着玩家需要依赖路点文本中的线索来寻找。<br/><br/>这种模式非常适合于更多基于谜题的任务，但请确保您为特工提供足够的线索，以便找到所有路点。",
            "MC_ANY_ORDER": "&nbsp;&nbsp;任意顺序",
            "MC_ANY_ORDER_DESC": "特工以任意顺序访问门户和实地考察标记。非常适合那些不需要特定路线的一次性任务，但不适合横幅系列任务。<br /><br /><span class='stopthat'>强烈建议，如果您正在为横幅制作任务，请将它们设置为顺序任务,您在IngressMosaik上的评分将对您表示感激！",
            "MC_FOOTER_NEXT": "任务信息 >>",
            // 任务信息页面表单
            "MI_TITLE": "编辑任务信息：",
            "MI_NAME": "任务名",
            "MI_NAME_PLACEHOLDER": "添加任务名",
            "MI_DESCRIPTION": "任务信息",
            "MI_DESCRIPTION_PLACEHOLDER": "添加任务信息",
            // 任务信息页面图标
            "MI_ICON_LABEL": "选择任务图标 (建议尺寸：512*512 px)",
            "MI_ICON_UPLOAD_BTN": "上传",
            "MI_ICON_CLEAR_BTN": "清除",
            "MI_ICON_PREVIEW": "预览",
            "MI_ICON_LOGO": "图标",
            "MI_ICON_MEDAL": "徽章",
            // 任务信息页面页脚按钮
            "MI_FOOTER_BACK": "<< 返回",
            "MI_FOOTER_NEXT": "选择导航点 >>",
            // 任务导航页面页脚按钮
            "MW_FOOTER_MISSIONS": "附近任务",
            "MW_FOOTER_BACK": "<< 返回",
            "MW_FOOTER_NEXT": "任务预览 >>",
            // 任务预览页面
            "MF_DEFAULT_OPTIONAL": "【可选】将此任务添加到分类：",
        },
    }
}
const LOCAL_TXT = deepAssign(_DEFAULT_LOCAL_TXT, _LOCAL_TXT_DICT[window.navigator.language])
console.log(LOCAL_TXT)

$(function () {
    'use strict';
    //Latest version of Bootstrap, and correct version of jQuery
    $("link[href='vendor/bootstrap/css/bootstrap.css']").attr("href", "https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");
    //$('body').append('<script src="https://code.jquery.com/ui/1.10.4/jquery-ui.min.js"></script>');

    // Modify time conversion variables to ones with actual granularity
    TimeConversionConstants.MINUTE_GRANULARITY_MINUTES = 1;
    TimeConversionConstants.HOUR_GRANULARITY_MINUTES = 15;
    TimeConversionConstants.DAY_GRANULARITY_HOURS = 12;

    //Build CSS rules
    //添加额外的CSS样式
    $("head").append(`<style>
.navbar-my-missions                                                                         {cursor: pointer;}
.list > .bordered-panel                                                                     {padding: 15px;}
.list .missions-list,.missions-list .panel-body .row                                        {display: flex;flex-wrap: wrap;}
.list .create-mission-button                                                                {margin: 0 5px;float: none!important;display: inline-block;}
.missions-list, .name-view .bordered-panel, .type-view .bordered-panel                      {opacity: 0; transition: opacity 0.5s}
.missions-list.ready, .name-view .bordered-panel.ready, .type-view .bordered-panel.ready    {opacity:1}
.missions-list .mission                                                                     {border-width: 2px;  margin: 10px 0 0; position: relative; padding: 5px; display: block;}
.list .mission .action-button                                                               {width: 100%; min-width: initial; max-width: initial;}
.mission-header-container                                                                   {display: flex; align-items: stretch;}
.mission-header-container div:nth-of-type(1)                                                {padding-right: 5px; width: 60px}
.mission-header-container div:nth-of-type(2)                                                {width: calc(100% - 115px)}
.mission-header-container div:nth-of-type(3)                                                {padding-left: 5px; width: 45px}
.button, button                                                                             {background-image: none;}
.mission .name.glyphicon                                                                    {font-size: 40px;}
.mission .name:not(.glyphicon)                                                              {text-align: center; display: block;}
.mission table                                                                              {margin: 5px 0 10px;}
.missions-list .panel-default                                                               { border-color: #5afbea; background-color: black; border-radius: 0;}
.missions-list .panel-default>.panel-heading                                                {color: #5afbea; background: #1f4549; border-radius: 0;}
.missions-list .panel-default>.panel-heading a:hover                                        {color: #5afbea;}
.missions-list .panel-default>.panel-heading+.panel-collapse>.panel-body                    {border-top-color: black; padding-top: 0;}
.missions-list .panel-heading a:after                                                       {  font-family: 'Glyphicons Halflings';  content: '\\e114';  float: right;  color: 5afbea;  position: relative;  left: 10px; }
.missions-list .panel-heading h4.collapsed a:after                                          {content: '\\e080'; }
.ui-state-highlight                                                                         { border: 2px solid #5afbea; background: #1f4549; margin-top: 10px;display: block;padding: 0 15px; min-height: 100px;}
.modal                                                                                      {color: black;}
.banner-preview .modal-body                                                                 {background-color: #222;}
.banner-preview .row                                                                        {display: flex; flex-direction: row-reverse; flex-wrap:wrap-reverse!important}
.banner-preview img                                                                         {border-radius: 50%;border: 3px solid goldenrod;}
.banner-preview .col-xs-2                                                                   {padding-bottom: 15px;}
.mission-list-item-published                                                                {background-image: none; background: #001a00; border-color: darkgreen;color: lightgreen;}
.list .mission .mission-title-published                                                     {color: lightgreen;}
.mission-list-item-published .table-bordered *                                              {border-color: lightgreen;}
.mission-list-item-published .button                                                        {color: lightgreen; border-color: lightgreen; background-color: #004d00;}
.mission-list-item-published .button:hover                                                  {background-color: #003300;}
.mission-list-item-published .button .caret                                                 {border-bottom-color: lightgreen;}
.mission-list-item-draft                                                                    {background-image: none; background-color: #170703; border-color: #a42e12;color: #f7ba5f;}
.list .mission .mission-title-draft                                                         {color: #f7ba5f;}
.mission-list-item-draft .table-bordered *                                                  {border-color: #f7ba5f;}
.mission-list-item-draft .button                                                            {color: #f7ba5f; border-color: #f7ba5f; background-color: #8a280f;}
.mission-list-item-draft .button:hover                                                      {background-color: #73210d;}
.mission-list-item-draft .button .caret                                                     {border-bottom-color: #f7ba5f;}
.mission-list-item-draft_of_published_mission                                               {background-image: none; background-color: #1a1a00; border-color: olive;color: greenyellow;}
.list .mission .mission-title-draft_of_published_mission                                    {color: greenyellow;}
.mission-list-item-draft_of_published_mission .table-bordered *                             {border-color: greenyellow;}
.mission-list-item-draft_of_published_mission .button                                       {color: greenyellow; border-color: greenyellow; background-color: #666600;}
.mission-list-item-draft_of_published_mission .button:hover                                 {background-color: #4d4d00;}
.mission-list-item-draft_of_published_mission .button .caret                                {border-bottom-color: greenyellow;}
.mission-list-item-submitted                                                                {background-image: none; background-color: #181201; border-color: darkgoldenrod;color: gold;}
.list .mission .mission-title-submitted                                                     {color: gold;}
.mission-list-item-submitted .table-bordered *                                              {border-color: gold;}
.mission-list-item-submitted .button                                                        {color: gold; border-color: gold; background-color: #916a08;}
.mission-list-item-submitted .button:hover                                                  {background-color: #785807;}
.mission-list-item-submitted .button .caret                                                 {border-bottom-color: gold;}
.mission-list-item-disabled                                                                 {background-image: none; background-color: #0d0d0d; border-color: #6b6b6b; color: red;}
.list .mission .mission-title-disabled                                                      {color: red;}
.mission-list-item-disabled .table-bordered *                                               {border-color: red;}
.mission-list-item-disabled .button                                                         {color: red; border-color: red; background-color: #595959;}
.mission-list-item-disabled .button:hover                                                   {background-color: #4d4d4d;}
.mission-list-item-disabled .button .caret                                                  {border-bottom-color: red;}
.mission-list-item-submitted_and_published                                                  {background-image: none; background-color: #0f1405; border-color: olivedrab;color: springgreen;}
.list .mission .mission-title-submitted_and_published                                       {color: springgreen;}
.mission-list-item-submitted_and_published .table-bordered *                                {border-color: springgreen;}
.mission-list-item-submitted_and_published .button                                          {color: springgreen; border-color: springgreen; background-color: #5c7a1f;}
.mission-list-item-submitted_and_published .button:hover                                    {background-color: #4d6619;}
.mission-list-item-submitted_and_published .button .caret                                   {border-bottom-color: springgreen;}
.dropup                                                                                     {position: relative;}
.dropup .dropdown-menu                                                                      {top: initial; bottom: 30px; left: 0; right: 0; text-align: center;}
.dropdown-menu > li > a                                                                     {cursor: pointer;}
.editor .view                                                                               {width: initial;height: initial;text-align: center;margin: 0;}
.editor .type-view, .editor .name-view                                                      {width: 100%;}
.pagination>li>a                                                                            {background: #0b0c0d;border-color: #5afbea;color: #5afbea; font-size: 18px;}
.pagination>li>a:hover                                                                      {background: #2b2c2d;border-color: #5afbea;color: #5afbea;}
.pagination>li>a[disabled]                                                                  {color: #ACAFAF;}
.pagination>li>a[disabled]:hover                                                            {cursor: default; background: #0b0c0d;border-color: #5afbea;color: #ACAFAF;}
.pagination>.active>a, .pagination>.active>a:hover                                          {background-color: #5afbea;border-color: #5afbea;color: #0b0c0d;}
.type-view .btn.focus, .type-view .btn:focus, .type-view .btn:hover                         {color: unset;}
.type-view .btn.active.focus, .type-view .btn.active:focus, .type-view .btn.active:hover    {color: #ebbc4a;}
.type-view .bordered-panel p                                                                {font-size: 20px;}
.stopthat                                                                                   {color: red; font-weight: bold;}
input.form-control, textarea.form-control                                                   {border: 1px solid #5afbea; background: none; border-radius: 0; color: white;}
.upload-logo .input-row .upload-label                                                       {display: block;padding: 0 0 10px;}
.upload-logo .input-row                                                                     {display: block;}
.upload-logo .input-row .upload-logo-cell, .upload-logo .input-row .clear-logo-button       {display: inline-block;padding: 0; max-width: 50%;}
.editor .waypoints-view .waypoints .waypoint.unselected                                     {background-color: #000;}
.editor .waypoints-view .waypoints .waypoint .number                                        {cursor: move;}
.preview-mission .body-panel .panel-container .map                                          {height: unset;}
.preview-mission .body-panel .panel-container .category-dropdown                            {margin-top: 20px;}
.preview-mission .mission-header                                                            {margin: 0; width: 65%; float: left;)}
.preview-mission .mission-stats, .preview-mission .mission-description                      {max-width: 35%;float: right; display: inline-block;}
#previewMissionModel .loading-screen                                                        { top: 0; right: 0; position: relative; height: 40px;}
#previewMissionModel .loading.spin                                                          { position: fixed; left: 50%; top: 80px; }
</style>`);
});

function init() {
    //
    const w = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
    let tryNumber = 15;

    const initWatcher = setInterval(() => {
        if (tryNumber === 0) {
            clearInterval(initWatcher);
            alert("IMATTC initialisation failed, please refresh the page");
        }
        if (w.angular) {
            let err = false;
            try {
                initAngular();
            } catch (error) {
                clearInterval(initWatcher);
                err = error;
                console.log(error);
            }
            if (!err) {
                try {
                    clearInterval(initWatcher);
                    pageChange()
                } catch (error) {
                    console.log(error);
                }
            }
        }
        tryNumber--;
    }, 1000);

    function initAngular() {
        const el = w.document.querySelector("*[ng-app]");
        w.$app = w.angular.element(el);
        w.$injector = w.$app.injector();
        w.$rootScope = w.$app.scope();
        w.$filter = w.$app.injector().get('$filter');
        w.$compile = w.$app.injector().get('$compile');
        w.$location = w.$app.injector().get('$location');
        w.$timeout = w.$app.injector().get('$timeout');
        w.$q = w.$app.injector().get('$q');
        w.$http = w.$app.injector().get('$http');
        w.WireUtil = w.$app.injector().get('WireUtil');
        w.Api = w.$app.injector().get('Api');

        w.$rootScope.$on('$routeChangeStart', function (next, last) {
            setTimeout(() => {
                pageChange()
            }, 500);
        });

        w.$scope = element => w.angular.element(element).scope();
    }

    function pageChange() {
        var loadingElement = $('div.loading-screen');
        var loadingScope = w.$scope(loadingElement);
        if (!loadingScope.hasPendingRequests()) {
            whenItsLoaded()
        } else {
            setTimeout(() => {
                pageChange();
            }, 250);
        }
    }

    function whenItsLoaded() {
        var missionScope = w.$scope($('div.list'));

        if (missionScope) {
            missionListSetup(missionScope);
        } else {
            var editScope = w.$scope($('div.editor'));
            if (editScope) {
                missionEditSetup(editScope);
            } else {
                var previewScope = w.$scope($('div.preview-mission'));
                if (previewScope) {
                    missionPreviewSetup(previewScope);
                }
            }
        }
    }

    function missionPreviewSetup(previewScope) {
        //$('body').css('margin-top','0');
    };

    /**
     * 任务编辑页面设置
     * @param editScope
     */
    function missionEditSetup(editScope) {
        var editStep = editScope.mission.ui.view;
        console.log("=========================")
        console.log(editScope);
        console.log("=========================")
        console.log(editStep);

        //overwrite submitMission function to inject categorisation
        editScope.submitMission = function () {
            var b = WireUtil.convertMissionLocalToWire(editScope.mission)
                , d = angular.copy(b);
            d.submit = true;
            editScope.saving = true;
            editScope.savingFailed = false;
            editScope.saved = false;
            w.$http.post(w.Api.SAVE_MISSION, d).success(function (d) {
                editScope.saving = false;
                editScope.saved = true;
                editScope.savedWireMission = b;
                //if a category is selected, push the mission to that category
                if (editScope.selectedCategoryID) {
                    editScope.categoryContent[editScope.selectedCategoryID].missions.push(editScope.savedWireMission.mission_guid);
                    editScope.categoryContent[editScope.selectedCategoryID].collapse = false;
                    editScope.selectedCategoryID = null;
                    w.localStorage.setItem('allCategories', JSON.stringify(editScope.categoryContent));
                }
                w.$location.url("/")
            }).error(function (b) {
                editScope.saving = false;
                editScope.savingFailed = true
            })
        }

        editScope.isBreadcrumbDisabled = function (step) {
            var validGoTo = false;
            switch (step) {
                case editScope.EditorScreenViews.TYPE:
                case editScope.EditorScreenViews.NAME:
                    validGoTo = editScope.isTypeValid();
                    break;
                case editScope.EditorScreenViews.WAYPOINTS:
                    validGoTo = editScope.isTypeValid() && !editScope.detailsErrors.hasErrors;
                    break;
                case editScope.EditorScreenViews.PREVIEW:
                    validGoTo = editScope.isTypeValid() && !editScope.detailsErrors.hasErrors && !editScope.waypointErrors.hasErrors
            }
            return !validGoTo;
        }

        //Replace breadcrumb with something a bit clearer
        $(".view").empty();
        var newBreadcrumb = `<ul class='pagination'>
            <li ${(editScope.IsViewActive(editScope.EditorScreenViews.TYPE) ? " class='active'" : "")}>
                <a role='button' ng-disabled='isBreadcrumbDisabled(EditorScreenViews.TYPE)' ng-click='bulletSetView(EditorScreenViews.TYPE)'>
                ${LOCAL_TXT.CREATE_PAGE.MISSION_TYPE}</a></li>
            <li ${(editScope.IsViewActive(editScope.EditorScreenViews.NAME) ? " class='active'" : "")}>
                <a role='button' ng-disabled='isBreadcrumbDisabled(EditorScreenViews.NAME)' ng-click='bulletSetView(EditorScreenViews.NAME)'>
                ${LOCAL_TXT.CREATE_PAGE.MISSION_DETAILS}</a></li>
            <li ${(editScope.IsViewActive(editScope.EditorScreenViews.WAYPOINTS) ? " class='active'" : "")}>
                <a role='button' ng-disabled='isBreadcrumbDisabled(EditorScreenViews.WAYPOINTS)' ng-click='bulletSetView(EditorScreenViews.WAYPOINTS)'>
                ${LOCAL_TXT.CREATE_PAGE.WAYPOINTS}</a></li>
            <li ${(editScope.IsViewActive(editScope.EditorScreenViews.PREVIEW) ? " class='active'" : "")}>
                <a role='button' ng-disabled='isBreadcrumbDisabled(EditorScreenViews.PREVIEW)' ng-click='bulletSetView(EditorScreenViews.PREVIEW)'>
                ${LOCAL_TXT.CREATE_PAGE.PREVIEW}</a></li>
            </ul>`;
        var compiledBread = $compile(newBreadcrumb)(editScope);
        $(".view").append(compiledBread);

        //view specific fixes
        var editCode, editTarget, compiledContent;
        switch (editStep) {
            case editScope.EditorScreenViews.TYPE:
                editTarget = $(".type-view .bordered-panel");
                //Overhauled UI on Mission Type page, including more editorialising on non-linear missions in banners
                $(".type-view .bordered-panel").empty().addClass('ready');
                editCode = `
                    <div class='btn-group btn-group-justified'>
                        <div class='btn-group'>
                            <button class='btn btn-lg' ng-click='mission.definition._sequential = true; mission.definition._hidden = false' ng-class='{active: mission.definition._sequential && !mission.definition._hidden}'>
                                <i class='glyphicon glyphicon-arrow-right'/>${LOCAL_TXT.CREATE_PAGE.MC_SEQUENTIAL}</button></div>
                    <div class='btn-group'>
                        <button class='btn btn-lg' ng-click='mission.definition._sequential = true; mission.definition._hidden = true' ng-class='{active: mission.definition._sequential && mission.definition._hidden}'>
                            <i class='glyphicon glyphicon-eye-close'/>${LOCAL_TXT.CREATE_PAGE.MC_HIDDEN_SEQUENTIAL}</button></div>
                    <div class='btn-group'>
                        <button class='btn btn-lg' ng-click='mission.definition._sequential = false; mission.definition._hidden = false' ng-class='{active: !mission.definition._sequential}'>
                            <i class='glyphicon glyphicon-random'/>${LOCAL_TXT.CREATE_PAGE.MC_ANY_ORDER}</button></div>
                    </div>
                    <br />
                    <p ng-show='mission.definition._sequential && !mission.definition._hidden'>${LOCAL_TXT.CREATE_PAGE.MC_SEQUENTIAL_DESC}</p>
                    <p ng-show='mission.definition._sequential && mission.definition._hidden'>${LOCAL_TXT.CREATE_PAGE.MC_HIDDEN_SEQUENTIAL_DESC}</p>
                    <p ng-show='!mission.definition._sequential'>${LOCAL_TXT.CREATE_PAGE.MC_ANY_ORDER_DESC}</span></p>`;
                break;
            case editScope.EditorScreenViews.NAME:
                editTarget = $(".name-view .bordered-panel");
                //Overhauled UI on Mission Name/Image pages
                $(".name-view .bordered-panel").empty().addClass('ready');
                editCode = `
                    <div class='row'>
                        <div class='col-sm-8 form-horizontal'>
                            <div class='form-group'>
                                <label for='missionName' class='col-sm-2 control-label'>${LOCAL_TXT.CREATE_PAGE.MI_NAME}</label>
                                <div class='col-sm-10'>
                                    <input type='text' id='missionName' ng-model='mission.definition.name' class='form-control' 
                                        placeholder='${LOCAL_TXT.CREATE_PAGE.MI_NAME_PLACEHOLDER}' ng-class="{'invalid': !mission.definition.name}" 
                                        maxlength='${editScope.MissionRules.MAX_MISSION_NAME_LENGTH}'>
                                </div>
                            </div>
                            <div class='form-group'>
                                <label for='missionDesc' class='col-sm-2 control-label'>${LOCAL_TXT.CREATE_PAGE.MI_DESCRIPTION}</label>
                                <div class='col-sm-10'>
                                    <textarea id='missionDesc' class='form-control' rows='4' ng-model='mission.definition.description' 
                                        placeholder='${LOCAL_TXT.CREATE_PAGE.MI_DESCRIPTION_PLACEHOLDER}' ng-class="{'invalid': !mission.definition.description}" 
                                        maxlength='${editScope.MissionRules.MAX_MISSION_DESCRIPTION_LENGTH}'></textarea>
                                </div>
                            </div>
                        </div>
                        <div class='col-sm-4'>
                            <div mission-logo-upload max-size='{{LogoParams.MAX_SIZE_BYTES}}' success='logoUploadSuccess' error='logoUploadFailure' 
                                pre-post='ensureMissionHasGuid' accept='image/*' type-restriction='image/(gif|jpeg|jpg|png)' mission='mission'></div>
                        </div>
                    </div>`;
                break;
            case editScope.EditorScreenViews.WAYPOINTS:
                //Adding drag-and-drop mission reordering
                //First, watch whether the user can see the list of waypoints
                editScope.$watch('shouldShowWaypointList()', function () {
                    //if so, wait half a second and apply the JQueryUI sortable parameter to the list thereof
                    if (editScope.shouldShowWaypointList()) {
                        setTimeout(() => {
                            //checks start position on start, end position on end, and sends them to the native change position function
                            $('#waypoints').sortable({
                                handle: '.number',
                                axis: 'y',
                                start: function (event, ui) {
                                    var start_pos = ui.item.index();
                                    ui.item.data('start_pos', start_pos);
                                },
                                update: function (event, ui) {
                                    var start_pos = ui.item.data('start_pos');
                                    var end_pos = ui.item.index();
                                    editScope.$apply(function () {
                                        editScope.changeWaypointPosition(start_pos, end_pos);
                                    });
                                    editScope.mission.definition.waypoints.forEach(function (waypoint) {
                                        editScope.setSelectedWaypoint(waypoint);
                                    });
                                    editScope.setSelectedWaypoint(editScope.mission.definition.waypoints[end_pos]);
                                }
                            });
                        }, 500);
                    }
                });
                break;
            case editScope.EditorScreenViews.PREVIEW:
                //If there are user generated categories, add a dropdown to add the new mission to one
                editScope.categoryContent = JSON.parse(w.localStorage.getItem('allCategories')) || [];
                if (editScope.categoryContent.length > 0 && editScope.mission.mission_guid) {
                    var showCategory = true;
                    editScope.categoryContent.forEach(function (category) {
                        for (var i = 0; i < category.missions.length; i++) {
                            if (category.missions[i] == editScope.mission.mission_guid) {
                                showCategory = false;
                                break;

                            }
                        }
                    })
                    if (showCategory) {
                        editScope.selectedCategoryID = null;
                        editTarget = $(".body-panel > .panel-container");
                        editCode = `
                <div class="category-dropdown">
                    <select class="form-control" ng-model="selectedCategoryID">
                        <option value="null">${LOCAL_TXT.CREATE_PAGE.MF_DEFAULT_OPTIONAL}</option>
                        ${editScope.categoryContent.map((content, i) => `<option value="${i}">${content.name}</option>`).join('')}
                    </select>
                </div>`;
                    }
                }
                break;
        }
        if (editCode) {
            compiledContent = $compile(editCode)(editScope);
            editTarget.append(compiledContent);
        }

        //Runs pageChange() function when changing between Edit states
        editScope.setView = function (b) {
            editScope.pendingSave && (w.$timeout.cancel(editScope.pendingSave), editScope.pendingSave = null);
            editScope.save(b);
            setTimeout(() => {
                pageChange();
                translateText();
            }, 500);
        }

        setTimeout(function () {
            let otherText = {
                "MC_TITLE": "body > div.container.ng-scope > div > div.type-view.ng-scope > h3",
                "MC_FOOTER_NEXT": "body > div.container.ng-scope > div > div.type-view.ng-scope > div.footer-buttons > button",
                "MI_FOOTER_BACK": "body > div.container.ng-scope > div > div.name-view.ng-scope > div.footer-buttons > button:nth-child(1)",
                "MI_FOOTER_NEXT": "body > div.container.ng-scope > div > div.name-view.ng-scope > div.footer-buttons > button:nth-child(2)",
                "MI_ICON_LABEL": "body > div.container.ng-scope > div > div.name-view.ng-scope > div.bordered-panel.ready > div > div.col-sm-4 > div > div:nth-child(1) > div > div.upload-label",
                "MI_ICON_UPLOAD_BTN": "body > div.container.ng-scope > div > div.name-view.ng-scope > div.bordered-panel.ready > div > div.col-sm-4 > div > div:nth-child(1) > div > div.upload-logo-cell > label",
                "MI_ICON_CLEAR_BTN": "body > div.container.ng-scope > div > div.name-view.ng-scope > div.bordered-panel.ready > div > div.col-sm-4 > div > div:nth-child(1) > div > div.clear-logo-button > button",
                "MI_ICON_PREVIEW": "body > div.container.ng-scope > div > div.name-view.ng-scope > div.bordered-panel.ready > div > div.col-sm-4 > div > div:nth-child(3)",
                "MI_ICON_LOGO": "body > div.container.ng-scope > div > div.name-view.ng-scope > div.bordered-panel.ready > div > div.col-sm-4 > div > div:nth-child(4) > div.uploaded-images-headers > div:nth-child(1)",
                "MI_ICON_MEDAL": "body > div.container.ng-scope > div > div.name-view.ng-scope > div.bordered-panel.ready > div > div.col-sm-4 > div > div:nth-child(4) > div.uploaded-images-headers > div:nth-child(2)",
                "MI_TITLE": "body > div.container.ng-scope > div > div.name-view.ng-scope > h3",
                "MW_FOOTER_MISSIONS": "body > div.container.ng-scope > div > div.waypoints-view.ng-scope > div.footer > div.pull-left > button",
                "MW_FOOTER_BACK": "body > div.container.ng-scope > div > div.waypoints-view.ng-scope > div.footer > div.pull-right > button:nth-child(1)",
                "MW_FOOTER_NEXT": "body > div.container.ng-scope > div > div.waypoints-view.ng-scope > div.footer > div.pull-right > button:nth-child(2)",
                "": "",
                "": "",
                "": "",
                "": "",
            }
            for (let key in otherText) {
                let element = document.querySelector(otherText[key]);
                if (element) {
                    element.innerText = LOCAL_TXT.CREATE_PAGE[key] || element.innerText;
                }
            }
        }, 500)
    }

    function missionListSetup(missionScope) {

        missionScope.getFullMissionData = function (missions) {
            var dfd = w.$q.defer();
            var missionPromises = [];
            angular.forEach(missions, function (mission) {
                if (mission.missionListState != "DRAFT" && mission.missionListState != "SUBMITTED") {
                    var mId = mission.mission_guid;
                    missionPromises.push($http.post(window.origin + "/api/author/getMissionForProfile", {mission_guid: mId}));
                } else {
                    var mId = mission.draft_mission_id || mission.submitted_mission_id;
                    missionPromises.push($http.post(window.origin + "/api/author/getMission", {mission_id: mId}));
                }
            });
            w.$q.all(missionPromises).then(function (results) {
                    var missionData = [];
                    for (var i = 0; i < results.length; i++) {
                        if (results[i] !== undefined) {
                            var f = WireUtil.convertMissionWireToLocal(results[i].data.mission, results[i].data.pois);
                            missionData.push(f.definition);
                        } else {
                            missionData.push(null)
                        }
                    }
                    dfd.resolve(missionData);
                },
                function (data, status) {
                    console.error('error: ', status, data);
                }
            )
            return dfd.promise;
        }

        missionScope.categoryContent = [];
        missionScope.categorisedMissions = [];
        missionScope.uncategorisedMissions = [];
        missionScope.uncategorisedSort = 'initial';
        missionScope.missions = w.$filter("orderBy")(missionScope.missions, 'definition.name');
        missionScope.loadingPreview = false;
        missionScope.unsortedCollapse = {collapse: w.localStorage.getItem('unsortedCollapse') || true};

        //handling for legacy data format
        if (!!w.localStorage.getItem('categoryNames')) {
            let oldegoriesLength = parseInt(w.localStorage.getItem('categoriesLength')) || 0,
                categoryNames = w.localStorage.getItem('categoryNames') ? w.localStorage.getItem('categoryNames').split(',') : [],
                thisCategory;
            //create categories in new format
            for (var i = 0; i < oldegoriesLength; i++) {
                thisCategory = {
                    id: i,
                    name: categoryNames[i],
                    missions: w.localStorage.getItem('categoryContent' + i) ? w.localStorage.getItem('categoryContent' + i).split(',') : [],
                    collapse: true,
                    sortCriteria: 'initial'
                };
                missionScope.categoryContent.push(thisCategory);
                w.localStorage.removeItem('categoryContent' + i);
            }
            w.localStorage.setItem('allCategories', JSON.stringify(missionScope.categoryContent));

            //now tidy up the legacy data
            w.localStorage.removeItem('categoryNames');
            w.localStorage.removeItem('categoriesLength');
        }

        //get data for all categories
        missionScope.categoryContent = JSON.parse(w.localStorage.getItem('allCategories')) || [];
        missionScope.selectedCategoryMissionId = null;

        //Add position in initial array
        for (var i = 0; i < missionScope.missions.length; i++) {
            missionScope.missions[i].position = i;
        }

        //function to calculate distances between two sets of coordinates taken from geodatasource.com
        missionScope.distance = function (lat1, lon1, lat2, lon2, unit) {
            if ((lat1 == lat2) && (lon1 == lon2)) {
                return 0;
            } else {
                var radlat1 = Math.PI * lat1 / 180;
                var radlat2 = Math.PI * lat2 / 180;
                var theta = lon1 - lon2;
                var radtheta = Math.PI * theta / 180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180 / Math.PI;
                dist = dist * 60 * 1.1515;
                if (unit == "K") {
                    dist = dist * 1.609344
                }
                if (unit == "N") {
                    dist = dist * 0.8684
                }
                return dist;
            }
        }

        missionScope.previewMission = function (guid) {
            $('#previewMissionModel .modal-body .notloading').empty();
            missionScope.loadingPreview = true;
            var mission = w.$filter('filter')(missionScope.missions, {mission_guid: guid})[0];
            if (mission) {
                missionScope.getFullMissionData([mission]).then(function (data) {
                    mission.definition = data[0];
                    //calculate approx. mission length
                    var distance = 0;
                    for (var i = 1; i < mission.definition.waypoints.length; i++) {
                        distance += missionScope.distance(
                            mission.definition.waypoints[i - 1]._poi.location.latitude,
                            mission.definition.waypoints[i - 1]._poi.location.longitude,
                            mission.definition.waypoints[i]._poi.location.latitude,
                            mission.definition.waypoints[i]._poi.location.longitude,
                            "K")
                    }

                    missionScope.loadingPreview = false;
                    w.$injector.invoke(function ($compile) {
                        var modalContent = "<div preview-mission mission='missions[" + mission.position + "]' mission-preview-state='\"" + MissionPreviewStates.PROFILE + "\"'></div>";
                        var compiledContent = $compile(modalContent)(missionScope);
                        // Put the output of the compilation in to the page using jQuery
                        $('#previewMissionModel .modal-body .notloading').append(compiledContent);
                        if (distance < 1) {
                            distance = (Math.floor(distance * 100000) / 100) + "m";
                        } else {
                            distance = (Math.floor(distance * 100) / 100) + "km";
                        }
                        setTimeout(function () {
                            $('.mission-stats-row').append('<div class="mission-stats-item"><span class="stats-value">' + distance + '</span></div>');
                        }, 10);
                    })
                })
            }
        }

        missionScope.previewBanner = function (category) {
            $('#previewMissionModel .modal-body .notloading').empty();
            missionScope.loadingPreview = true;
            missionScope.getFullMissionData(missionScope.categorisedMissions[category]).then(function (data) {
                missionScope.banner = {
                    definition: {
                        name: missionScope.categoryContent[category].name,
                        author_nickname: data[0].author_nickname,
                        description: data[0].description,
                        _sequential: data[0]._sequential,
                        logo_url: data[0].logo_url,
                        waypoints: []
                    },
                    stats: {
                        num_completed: missionScope.categorisedMissions[category][data.length - 1].stats ? missionScope.categorisedMissions[category][data.length - 1].stats.num_completed : 0,
                        rating: 0,
                        median_completion_time: 0
                    },
                };
                for (var i = 0; i < missionScope.categorisedMissions[category].length; i++) {
                    missionScope.banner.stats.rating += missionScope.categorisedMissions[category][i].stats ? missionScope.categorisedMissions[category][i].stats.rating : 0;
                    missionScope.banner.stats.median_completion_time += missionScope.categorisedMissions[category][i].stats ? missionScope.categorisedMissions[category][i].stats.median_completion_time : 0;
                    data[i].waypoints.forEach(function (wp) {
                        missionScope.banner.definition.waypoints.push(wp)
                    })
                }
                missionScope.banner.stats.rating = Math.round(missionScope.banner.stats.rating / data.length);
                //calculate approx. banner length
                var distance = 0;
                for (var j = 1; j < missionScope.banner.definition.waypoints.length; j++) {
                    distance += missionScope.distance(
                        missionScope.banner.definition.waypoints[j - 1]._poi.location.latitude,
                        missionScope.banner.definition.waypoints[j - 1]._poi.location.longitude,
                        missionScope.banner.definition.waypoints[j]._poi.location.latitude,
                        missionScope.banner.definition.waypoints[j]._poi.location.longitude,
                        "K")
                }

                missionScope.loadingPreview = false;
                w.$injector.invoke(function ($compile) {
                    var modalContent = "<div preview-mission mission='banner' mission-preview-state='\"" + MissionPreviewStates.PROFILE + "\"'></div>";
                    var compiledContent = $compile(modalContent)(missionScope);
                    // Put the output of the compilation in to the page using jQuery
                    $('#previewMissionModel .modal-body .notloading').append(compiledContent);
                    if (distance < 1) {
                        distance = (Math.floor(distance * 100000) / 100) + "m";
                    } else {
                        distance = (Math.floor(distance * 100) / 100) + "km";
                    }
                    setTimeout(function () {
                        $('.mission-stats-row').append('<div class="mission-stats-item"><span class="stats-value">' + distance + '</span></div>');
                    }, 10);
                })
            })
        }

        missionScope.selectACategory = function (mission) {
            missionScope.selectedCategoryMissionId = mission.mission_guid;
            $('#addCateModel .modal-title').text('Add \"' + mission.definition.name + '\" to...');
        }

        missionScope.addToCategory = function () {
            $(".modal-backdrop.fade").remove();
            $("body").removeClass("modal-open");
            var categoryID = missionScope.selectedCategoryID;
            missionScope.categoryContent[categoryID].missions.push(missionScope.selectedCategoryMissionId);
            missionScope.categoryContent[categoryID].collapse = false;
            missionScope.selectedCategoryMissionId = null;
            missionScope.selectedCategoryID = null;
            w.localStorage.setItem('allCategories', JSON.stringify(missionScope.categoryContent));
            generateAllMissions();
        }

        missionScope.removeFromCategory = function (category, mission) {
            for (var i = 0; i < missionScope.categoryContent[category].missions.length; i++) {
                if (missionScope.categoryContent[category].missions[i] == mission.mission_guid) {
                    missionScope.categoryContent[category].missions.splice(i, 1);
                }
            }
            w.localStorage.setItem('allCategories', JSON.stringify(missionScope.categoryContent));
            generateAllMissions();
        }

        missionScope.createCategory = function () {
            var categoryName = prompt("Please enter a name for your new category", "New category name");
            if (categoryName == null || categoryName == "") {
                //no result
            } else {
                //create category elements
                var newCategory = {
                    id: missionScope.categoryContent.length,
                    name: categoryName,
                    missions: [],
                    collapse: false,
                    sortCriteria: 'initial'
                };
                missionScope.categoryContent.push(newCategory);
                w.localStorage.setItem('allCategories', JSON.stringify(missionScope.categoryContent));
                generateAllMissions();
            }
        }

        missionScope.nukeCategories = function () {
            missionScope.categoryContent = [];
            w.localStorage.setItem('allCategories', null);
            generateAllMissions();
        }

        missionScope.deleteCategory = function (category) {
            if (confirm("Are you sure you want to delete the " + missionScope.categoryContent[category].name + " category? Any missions you've placed in this category will be retured to Unsorted missions.")) {
                //nuke localStorage category
                missionScope.categoryContent.splice(category, 1);
                w.localStorage.setItem('allCategories', JSON.stringify(missionScope.categoryContent));
                generateAllMissions();
            }
        }

        missionScope.sortCategory = function (category) {
            console.log("sortCategory >>>>> ", category)
            if (category == 'all') {
                missionScope.missions = w.$filter("orderBy")(missionScope.missions, missionScope.sortCriteria[0] == 'initial' ? 'position' : missionScope.sortCriteria[0]);
            } else if (category == 'unsorted') {
                missionScope.uncategorisedSort = missionScope.sortCriteria[missionScope.categoryContent.length];
            } else {
                missionScope.categoryContent[category].sortCriteria = missionScope.sortCriteria[category];
            }
            generateAllMissions();
        }

        missionScope.toggleCollapse = function (collapse, unsorted) {
            collapse.collapse = !collapse.collapse;
            unsorted ? w.localStorage.setItem('unsortedCollapse', collapse.collapse)
                : w.localStorage.setItem('allCategories', JSON.stringify(missionScope.categoryContent));
        }

        missionScope.dragMissions = function (start_pos, start_cat, end_pos, end_cat) {
            //first, parse category IDs and get categories
            var startCategory, endCategory, startCatID, endCatID, thismission;

            startCatID = isNaN(parseInt(start_cat.split('category')[1])) ? start_cat.split('category')[1] : parseInt(start_cat.split('category')[1]);
            endCatID = isNaN(parseInt(end_cat.split('category')[1])) ? end_cat.split('category')[1] : parseInt(end_cat.split('category')[1]);

            startCategory = startCatID == 'unsorted' ? missionScope.uncategorisedMissions : missionScope.categoryContent[startCatID];
            endCategory = endCatID == 'unsorted' ? missionScope.uncategorisedMissions : missionScope.categoryContent[endCatID];
            thismission = angular.copy(startCatID == 'unsorted' ? startCategory[start_pos - 1].mission_guid : missionScope.categorisedMissions[startCatID][start_pos - 1].mission_guid)

            //then remove start mission
            if (startCatID != 'unsorted') {
                for (var i = 0; i < startCategory.missions.length; i++) {
                    if (startCategory.missions[i] == thismission) {
                        startCategory.missions.splice(i, 1);
                        break;
                    }
                }
            }

            //then place end mission
            //unsortedMissions category has no sort criteria, so if end target is category, handle dropping mission in category
            if (endCategory.sortCriteria) {
                if (endCategory.sortCriteria == 'initial') {
                    //if category is in Initial sorting, respect that sorting
                    endCategory.missions.splice(end_pos - 1, 0, thismission);
                } else {
                    //if category is not in Inital sorting, dump mission at the end and set it to initial
                    endCategory.missions.push(thismission);
                    endCategory.sortCriteria = "initial";
                }
            }

            //then regenerate everything
            w.localStorage.setItem('allCategories', JSON.stringify(missionScope.categoryContent));
            generateAllMissions();
        }

        var generateSort = function (category) {
            var criteria = [
                {name: LOCAL_TXT.GENERATE_SORT.INITIAL, value: "initial"},
                {name: LOCAL_TXT.GENERATE_SORT.ALPHABETICAL_ASC, value: "definition.name"},
                {name: LOCAL_TXT.GENERATE_SORT.ALPHABETICAL_DESC, value: "-definition.name"},
                {name: LOCAL_TXT.GENERATE_SORT.CREATION_ORDER, value: "created_ms"},
                {name: LOCAL_TXT.GENERATE_SORT.MISSION_STATE, value: "missionListState"}
            ];
            missionScope.sortCriteria.push("");
            var sortContent = "<select style='width: 50%; display: inline-block; margin: 5px 0;' class='form-control' ng-model='sortCriteria[";
            //object literal switch for sort parameter
            let parameterLiteral = {
                "all": "0",
                "unsorted": missionScope.categoryContent.length,
                "default": category,
            }
            sortContent += parameterLiteral[category] || parameterLiteral["default"];

            sortContent += "]' ng-change='sortCategory(" + (Number.isInteger(category) ? category : "\"" + category + "\"") + ")' >";
            sortContent += "<option value=''>Sort" + (Number.isInteger(category) ? " category" : "") + " by...</option>";
            for (var i = 0; i < criteria.length; i++) {
                sortContent += "<option value='" + criteria[i].value + "'>" + criteria[i].name + "</option>";
            }
            sortContent += "</select>";
            return sortContent;
        }

        var generateMission = function (mission, id, selectedCategory) {
            let missionState = mission.missionListState.toLowerCase();
            let newMissionCode = "<div class='missionbox col-xs-12 col-sm-6 col-md-4'><div class='mission mission-list-item-" + missionState + "'>"
                + "<div class='mission-header-container'><div>"
                + "<img class='mission-image' src='" + (mission.definition.logo_url ? mission.definition.logo_url + "=s60-c" : "/images/button_logo.png") + "'>"
                + "</div><div>"
                + "<span class='name mission-title-" + missionState + "'>" + mission.definition.name + "</span>"
                + "</div><div>"
                + "<i class='name mission-title-" + missionState + " glyphicon glyphicon-";

            //object literal switch for which icon to show
            let iconLiteral = {
                "draft": "wrench' title='Unpublished draft mission'",
                "draft_of_published_mission": "wrench' title='Published mission with unpublished edits'",
                "published": "ok' title='Published mission'",
                "submitted": "time' title='Unpublished mission under review'",
                "submitted_and_published": "time' title='Published mission, changes under review'",
            };
            newMissionCode += iconLiteral[missionState];

            newMissionCode += "></i>"
                + "</div></div>"
                + "<span class='name mission-time-" + missionState + "'>" + missionScope.getInfoTime(mission) + "</span>"
                + "<table class='table table-bordered'";
            !mission.stats && (newMissionCode += " style='width: 20%;' ");
            newMissionCode += "><tr><td>";

            //object literal switch for mission type
            let mtypeLiteral = {
                "SEQUENTIAL": "<i class='glyphicon glyphicon-arrow-right' title='Sequential waypoints'></i>",
                "HIDDEN_SEQUENTIAL": "<i class='glyphicon glyphicon-eye-close' title='Hidden sequential waypoints'></i>",
                "NON_SEQUENTIAL": "<i class='glyphicon glyphicon-random' title='Non-linear waypoints (should not be used if the mission is part of a banner)'></i>",
            };
            newMissionCode += mtypeLiteral[mission.definition.mission_type];

            newMissionCode += "</td>";
            mission.stats && (
                newMissionCode += "<td><i class='glyphicon glyphicon-time'></i> " + missionScope.getMissionTimeString(mission) + "</td>"
                    + "<td><i class='glyphicon glyphicon-thumbs-up'></i> " + missionScope.getMissionRatingString(mission) + "</td>"
                    + "<td><i class='glyphicon glyphicon-user'></i> " + mission.stats.num_completed + "</td>"
            )
            newMissionCode += `</tr></table><div class='dropup'>
                                    <button class='button action-button dropdown-toggle' type='button' id='dropdownMenu1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>
                                        ${LOCAL_TXT.PERFORM_MISSION_ACTION}</button><ul class='dropdown-menu' aria-labelledby='dropdownMenu1'>`;
            missionScope.getButton1Title(mission) && (newMissionCode += "<li><a role='button' ng-click='button1Clicked(missions[" + id + "])'>" + missionScope.getButton1Title(mission) + "</a></li>");
            missionScope.getButton2Title(mission) && (newMissionCode += "<li><a role='button' ng-click='button2Clicked(missions[" + id + "])'>" + missionScope.getButton2Title(mission) + "</a></li>");
            newMissionCode += "<li role='separator' class='divider'></li>";
            //if mission is live, link to mission in Ingress intel and MAT preview thing
            if (missionState != "draft" && missionState != "submitted") {
                newMissionCode += "<li><a role='button' ng-click='previewMission(\"" + mission.mission_guid + "\")' data-toggle='modal' data-target='#previewMissionModel'>Preview Mission</a></li>";
                newMissionCode += "<li><a role='button' href='https://intel.ingress.com/mission/" + mission.mission_guid + "' target='_blank'>Open Mission In Intel</a></li>";
            }
            if (selectedCategory === false) {
                //adding unsorted mission to category
                newMissionCode += `<li><a role='button' ng-click='selectACategory(missions[${id}])' data-toggle='modal' data-target='#addCateModel'>${LOCAL_TXT.ADD_TO_CATEGORY}</a></li>`;
            } else {
                //removing a mission from a category
                newMissionCode += `<li><a role='button' ng-click='removeFromCategory(${selectedCategory}, missions[${id}])'>${LOCAL_TXT.REMOVE_FROM_CATEGORY}</a></li>`;
            }
            newMissionCode += "</ul></div>"
            newMissionCode += "</div></div>";
            return newMissionCode;
        }

        var generateAllMissions = function () {
            let scrollPosition = w.pageYOffset;
            $(".missions-list").empty();
            missionScope.categoryContent.length == 0 && ($(".missions-list").addClass("row"));
            missionScope.sortCriteria = [];
            w.$injector.invoke(function ($compile) {
                var missionContent = "";
                if (missionScope.categoryContent.length > 0) {
                    //if there are user-defined categories, first sort the categorised/uncategorised missions
                    missionScope.categorisedMissions = [];
                    missionScope.uncategorisedMissions = angular.copy(missionScope.missions);

                    //loop through each category of GUIDs, and add actual missions to scope
                    missionScope.categoryContent.forEach(function (category) {
                        var catobj = [];
                        category.missions.forEach(function (guid) {
                            //TODO: Do this with filters, not loops
                            for (var i = 0; i < missionScope.uncategorisedMissions.length; i++) {
                                //once the right mission is found, add position, push it to the holding array and remove from uncategorised
                                if (missionScope.uncategorisedMissions[i].mission_guid == guid) {
                                    catobj.push(missionScope.uncategorisedMissions[i]);
                                    missionScope.uncategorisedMissions.splice(i, 1);
                                    break;
                                }
                            }
                        })
                        missionScope.categorisedMissions.push(catobj);
                    })

                    //then get the categories sorted
                    missionScope.categoryContent.forEach(function (category) {
                        category.sortCriteria != 'initial' && (missionScope.categorisedMissions[category.id] = w.$filter("orderBy")(missionScope.categorisedMissions[category.id], category.sortCriteria));
                    })
                    missionScope.uncategorisedSort != 'initial' && (missionScope.uncategorisedMissions = w.$filter("orderBy")(missionScope.uncategorisedMissions, missionScope.uncategorisedSort));

                    //once all the categorisation is done, create the HTML for the categories!
                    missionContent += "<div class='panel-group' id='accordion' role='tablist' aria-multiselectable='true' style='width: 100%'>";
                    for (var i = 0; i < missionScope.categoryContent.length; i++) {
                        missionContent +=
                            `<div class='panel panel-default'>
                                <div class='panel-heading' role='tab'>
                                    <h4 class='panel-title' ng-class="{'collapsed ': categoryContent[${i}].collapse}">
                                        <a ng-click='toggleCollapse(categoryContent[${i}], false)' role='button' data-toggle='collapse'>
                                            ${missionScope.categoryContent[i].name}
                                        </a>
                                    </h4>
                                </div>
                                <div class='panel-collapse collapse' ng-class="{'in' : !categoryContent[${i}].collapse}" role='tabpanel'>
                                    <div class='panel-body'>
                                        <div id='category${i}' class='row'>
                                            <div class='col-xs-12 categoryFunctions'>
                                                ${generateSort(i)}
                                                <button class='btn btn-default' style='float: right!important;margin: 5px 0;' ng-click='deleteCategory(${i})'>
                                                    ${LOCAL_TXT.CATEGORY_OPT.DELETE_CATEGORY}
                                                </button>`;
                        if (!missionScope.categoryContent[i].missions || missionScope.categoryContent[i].missions.length == 0) {
                            //no missions so far!
                            missionContent += "</div><div class='col-xs-12'>No missions added to the category yet</div>";
                        } else {
                            missionContent += `
                                <button class='btn btn-default' style='float: right!important;margin: 5px;' data-toggle='modal' data-target='#previewBanner${i}'>${LOCAL_TXT.CATEGORY_OPT.PREVIEW_IMAGES}</button>
                                <button class='btn btn-default' style='float: right!important;margin: 5px;' ng-click='previewBanner(${i})' data-toggle='modal' data-target='#previewMissionModel'>${LOCAL_TXT.CATEGORY_OPT.PREVIEW_ROUTE}</button></div>`;
                            var bannerModal = `
                                    <div class='modal fade' id='previewBanner${i}' tabindex='-1' role='dialog'>
                                        <div class='modal-dialog modal-lg' role='document'>
                                            <div class='modal-content banner-preview'>
                                                <div class='modal-header'>
                                                    <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                                                        <span aria-hidden='true'>&times;</span>
                                                    </button>
                                                    <h4 class='modal-title'>Preview ${missionScope.categoryContent[i].name}</h4>
                                                </div>
                                            <div class='modal-body'>
                                                <div class='row'>`;
                            for (var j = 0; j < missionScope.categoryContent[i].missions.length; j++) {
                                var mission = missionScope.categorisedMissions[i][j];
                                if (mission == undefined) {
                                    missionScope.categoryContent[i].missions.splice(j, 1);
                                    j--;
                                    w.localStorage.setItem('allCategories', JSON.stringify(missionScope.categoryContent));
                                } else {
                                    missionContent += generateMission(mission, mission.position, i);
                                    bannerModal += "<div class='col-xs-2'><img class='img-responsive' src='" + (mission.definition.logo_url ? mission.definition.logo_url : "/images/button_logo.png") + "' /></div>";
                                }
                            }
                            bannerModal += "</div></div></div></div></div>";
                            missionContent += bannerModal;
                        }
                        missionContent += "</div></div></div></div>";
                    }
                    //add unsorted missions if there are any
                    missionContent +=
                        `<div class='panel panel-default'>
                            <div class='panel-heading' role='tab' id='header-unsorted'>
                                <h4 class='panel-title' ng-class="{'collapsed' : unsortedCollapse.collapse}">
                                    <a ng-click='toggleCollapse(unsortedCollapse, true)' role='button' data-toggle='collapse'>${LOCAL_TXT.UNSORTED_MISSIONS}</a>
                                </h4>
                            </div>
                            <div class='panel-collapse collapse' ng-class="{'in' : !unsortedCollapse.collapse}" role='tabpanel'>
                                <div class='panel-body'>
                                    <div id='categoryunsorted' class='row'>
                                        <div class='col-xs-12 categoryFunctions'>
                                            ${generateSort('unsorted')}
                                        </div>
                                        ${missionScope.uncategorisedMissions.map((mission, index) => generateMission(mission, index, false)).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        `;
                    // for (var i = 0; i < missionScope.uncategorisedMissions.length; i++) {
                    //     missionContent += generateMission(missionScope.uncategorisedMissions[i], missionScope.uncategorisedMissions[i].position, false);
                    // }
                    // missionContent += "</div></div></div></div></div>";
                } else {
                    //if no user-defined categories, just loop through the missions
                    missionContent += "<div class='col-xs-12'>"
                        + generateSort('all')
                        + "</div>";
                    for (var i = 0; i < missionScope.missions.length; i++) {
                        var mission = missionScope.missions[i];
                        missionContent += generateMission(mission, i, false);
                    }
                }
                //modal for adding missions to categories
                missionContent += "<div class='modal fade' id='addCateModel' tabindex='-1' role='dialog'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title'>{{missionTitle}}</h4></div><div class='modal-body'>"
                    + "<select class='form-control' ng-model='selectedCategoryID' ng-change='addToCategory()' >";
                for (var i = 0; i < missionScope.categoryContent.length; i++) {
                    missionContent += "<option value='" + i + "' data-dismiss='modal'>" + missionScope.categoryContent[i].name + "</option>";
                }
                missionContent += "</select></div></div></div></div>";

                //modal for previewing missions
                missionContent += "<div class='modal fade' id='previewMissionModel' tabindex='-1' role='dialog'><div class='modal-dialog modal-lg' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title'>Preview Mission</h4></div><div class='modal-body' style='background:#151515'>"
                    + "<div class='loading-screen' ng-show='loadingPreview'><div class='loading spin'></div></div><div class='notloading'></div>"
                    + "</div></div></div></div>";

                // Pass our fragment content to $compile, and call the function that $compile returns with the scope.
                var compiledContent = $compile(missionContent)(missionScope);
                // Put the output of the compilation in to the page using jQuery
                $('.missions-list').append(compiledContent);
                setTimeout(() => {
                    w.scrollTo(0, scrollPosition);
                }, 250);
                //now enable drag-drop for the missions!
                if (missionScope.categoryContent.length > 0) {
                    $('.row[id^=category]').each(function (idx, elem) {
                        console.log("=============================")
                        console.log("idx >>> ", idx)
                        console.log("elem >>> ", elem)
                        console.log("elem.id >>> ", elem.id)
                    });
                    $('.row[id^=category]').sortable({
                        items: "div.missionbox",
                        connectWith: ".row[id^=category]",
                        tolerance: "pointer",
                        placeholder: "ui-state-highlight col-xs-12 col-sm-6 col-md-3",
                        start: function (event, ui) {
                            var start_pos = ui.item.index();
                            ui.item.data('start_pos', start_pos);
                            ui.item.data('start_cat', ui.item[0].parentElement.id);
                        },
                        update: function (event, ui) {
                            var start_pos = ui.item.data('start_pos'),
                                start_cat = ui.item.data('start_cat'),
                                end_pos = ui.item.index(),
                                end_cat = ui.item[0].parentElement.id;
                            !ui.sender && missionScope.dragMissions(start_pos, start_cat, end_pos, end_cat);
                        }
                    });
                }
            });
        }

        missionScope.exportData = function () {
            navigator.clipboard.writeText(JSON.stringify(missionScope.categoryContent)).then(function () {
                alert('Category data copied to your clipboard - please paste this in the Import Data box in the browser you want to export this to')
            }, function () {
                alert('Something went wrong')
            });
        };

        missionScope.importData = function () {
            var dataInput = prompt("Please paste in the text you got from the Data Export on your other device");
            if (dataInput == null || dataInput == "") {
                //don't do anything
            } else {
                //try to parse data, then turn it into object
                try {
                    missionScope.categoryContent = JSON.parse(dataInput);
                    w.localStorage.setItem('allCategories', JSON.stringify(missionScope.categoryContent));
                    generateAllMissions();
                } catch (e) {
                    alert('Something went wrong!!');
                }
            }
        }

        //compiling the buttons
        w.$injector.invoke(function ($compile) {
            var buttonContent = "<div class='bordered-panel'>";

            //button for adding categories
            buttonContent += `<button ng-click='createCategory()' class='yellow create-mission-button'>${LOCAL_TXT.TOP_BTN.CREATE_NEW_CATEGORY}</button>
                <button ng-click='exportData()' class='yellow create-mission-button'>${LOCAL_TXT.TOP_BTN.EXPORT_CATEGORY_DATA}</button>
                <button ng-click='importData()' class='yellow create-mission-button'>${LOCAL_TXT.TOP_BTN.IMPORT_CATEGORY_DATA}</button>`;
            //buttonContent += "<button ng-click='nukeCategories()' class='yellow create-mission-button'>NUKE EVERYTHING</button>";

            //tally up available missions, and missions in draft states
            var draftMissions = w.$filter('filter')(missionScope.missions, {missionListState: "DRAFT"}, true).length;
            var dopMissions = w.$filter('filter')(missionScope.missions, {missionListState: "DRAFT_OF_PUBLISHED_MISSION"}, true).length;
            var submittedMissions = w.$filter('filter')(missionScope.missions, {missionListState: "SUBMITTED"}, true).length;
            var sapMissions = w.$filter('filter')(missionScope.missions, {missionListState: "SUBMITTED_AND_PUBLISHED"}, true).length;
            var publishedMissions = w.$filter('filter')(missionScope.missions, {missionListState: "PUBLISHED"}, true).length;
            var remainder = (w.$rootScope.user.mission_limit || 180) - (dopMissions + submittedMissions + sapMissions + publishedMissions);
            buttonContent += "<h4 style='line-height: 2;'>";
            remainder > 0 && (buttonContent += `<span class='label'>${LOCAL_TXT.MISSION_COUNT.MISSIONS_REMAINING.format(remainder)}</span> `);
            draftMissions > 0 && (buttonContent += `<span class='label mission-list-item-draft'>${LOCAL_TXT.MISSION_COUNT.UNPUBLISHED_DRAFTS.format(draftMissions)}</span> `);
            submittedMissions > 0 && (buttonContent += `<span class='label mission-list-item-submitted'>${LOCAL_TXT.MISSION_COUNT.UNDER_REVIEW.format(submittedMissions)}</span> `);
            dopMissions > 0 && (buttonContent += `<span class='label mission-list-item-draft_of_published_mission'>${LOCAL_TXT.MISSION_COUNT.BEING_AMENDED.format(dopMissions)}</span> `);
            sapMissions > 0 && (buttonContent += `<span class='label mission-list-item-submitted_and_published'>${LOCAL_TXT.MISSION_COUNT.CHANGES_UNDER_REVIEW.format(sapMissions)}</span> `);
            publishedMissions > 0 && (buttonContent += `<span class='label mission-list-item-published'>${LOCAL_TXT.MISSION_COUNT.PUBLISHED.format(publishedMissions)}</span> `);
            buttonContent += "</h4>"
            buttonContent += "</div>";
            // Pass our fragment content to $compile, and call the function that $compile returns with the scope.
            var compiledContent = $compile(buttonContent)(missionScope);
            // Put the output of the compilation in to the page using jQuery
            $('.list').prepend(compiledContent);
        });
        var btnCreateMission = $('.list div:not(.bordered-panel) button.yellow.create-mission-button');
        btnCreateMission[0].innerText = LOCAL_TXT.TOP_BTN.CREATE_NEW_MISSION;
        $('.list .bordered-panel').prepend(btnCreateMission);

        //initiating the missions
        $(".missions-list").removeClass("row").addClass('ready');
        generateAllMissions();
    }
}

setTimeout(() => {
    init();
}, 500);
