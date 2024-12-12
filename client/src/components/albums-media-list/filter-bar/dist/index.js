"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_select_1 = require("react-select");
var button_1 = require("@/components/button");
var color_styles_1 = require("@/components/multi-select-box/color-styles");
var format_option_label_1 = require("@/components/multi-select-box/format-option-label");
var eyeIcon_svg_1 = require("@/assets/eyeIcon.svg");
var eyeclose_svg_1 = require("@/assets/eyeclose.svg");
var index_module_scss_1 = require("./index.module.scss");
var FilterBar = function (_a) {
    var mediaOptions = _a.mediaOptions, isVisibility = _a.isVisibility, dispatchAlbum = _a.dispatchAlbum, selectedAlbumId = _a.selectedAlbumId, handleSearchEvent = _a.handleSearchEvent, handleSearchOption = _a.handleSearchOption;
    var handleSelectValue = function (selectedOption) {
        var selectionValue = selectedOption ? selectedOption.value : "";
        handleSearchOption({ selectValue: selectionValue });
    };
    var optionsMediaList = react_1.useMemo(function () { return mediaOptions === null || mediaOptions === void 0 ? void 0 : mediaOptions.find(function (option) { return option.value === selectedAlbumId; }); }, [mediaOptions, selectedAlbumId]);
    var formatOptionLabel1 = react_1.useCallback(function (data, metaData) {
        return format_option_label_1["default"]({
            data: {
                data: data,
                metaData: metaData,
                badge: true,
                mediaOption: true
            }
        });
    }, []);
    var styleColor = react_1.useMemo(function () {
        return color_styles_1["default"]({
            errorMessage: "",
            clearOption: true,
            mediaOption: true
        });
    }, []);
    return (React.createElement("div", { className: index_module_scss_1["default"].filterFieldContainer },
        React.createElement("input", { type: "text", name: "search", placeholder: "search", className: index_module_scss_1["default"].inputClassName, onChange: function (e) { return handleSearchEvent({ value: e.target.value }); } }),
        React.createElement("div", null,
            React.createElement(react_select_1["default"], { isClearable: true, options: mediaOptions, placeholder: "Select Album", className: index_module_scss_1["default"].selectBox, onChange: handleSelectValue, formatOptionLabel: formatOptionLabel1, styles: styleColor, value: optionsMediaList })),
        React.createElement(button_1["default"], { icon: eyeIcon_svg_1["default"], className: "" + (isVisibility ? index_module_scss_1["default"].btnActive : ""), tooltip: "Click here to see all visible media", handleClick: function () { return dispatchAlbum({ type: "IS_VISIBILITY_STATE", isVisibility: true }); } }),
        React.createElement(button_1["default"], { icon: eyeclose_svg_1["default"], className: "" + (!isVisibility ? index_module_scss_1["default"].btnActive : ""), tooltip: "Click here to see all hidden media", handleClick: function () { return dispatchAlbum({ type: "IS_VISIBILITY_STATE", isVisibility: false }); } })));
};
exports["default"] = react_1.memo(FilterBar);
