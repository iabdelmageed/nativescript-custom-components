/**
 * Copyright (C) 2020 Wasabeef
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * See about document.execCommand: https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
 */

var RE = {};
const oWebViewInterface = window.nsWebViewInterface;
RE.currentSelection = {
    "startContainer": 0,
    "startOffset": 0,
    "endContainer": 0,
    "endOffset": 0};

RE.editor = document.getElementById('editor');

document.addEventListener("selectionchange", function() { RE.backuprange(); });

oWebViewInterface.on('setHtml', function(contents) {
    RE.setHtml(contents);
});

// Initializations
RE.callback = function() {
    // window.location.href = "re-callback://" + encodeURIComponent(RE.getHtml());
    oWebViewInterface.emit('re-callback', encodeURIComponent(RE.getHtml()));
}

RE.setHtml = function(contents) {
    RE.editor.innerHTML = decodeURIComponent(contents.replace(/\+/g, '%20'));
}

RE.getHtml = function() {
    oWebViewInterface.emit('getHtml', RE.editor.innerHTML);
    return RE.editor.innerHTML;
}

RE.getText = function() {
    oWebViewInterface.emit('getText', RE.editor.innerText);
    return RE.editor.innerText;
}

oWebViewInterface.on('setBaseTextColor', function(color) {
    RE.setBaseTextColor(contents);
});

RE.setBaseTextColor = function(color) {
    RE.editor.style.color  = color;
}

oWebViewInterface.on('setBaseFontSize', function(size) {
    RE.setBaseFontSize(size);
});

RE.setBaseFontSize = function(size) {
    RE.editor.style.fontSize = size;
}

oWebViewInterface.on('setPadding', function(left, top, right, bottom) {
    RE.setPadding(left, top, right, bottom);
});

RE.setPadding = function(left, top, right, bottom) {
  RE.editor.style.paddingLeft = left;
  RE.editor.style.paddingTop = top;
  RE.editor.style.paddingRight = right;
  RE.editor.style.paddingBottom = bottom;
}

oWebViewInterface.on('setBackgroundColor', function(color) {
    RE.setBackgroundColor(color);
});
RE.setBackgroundColor = function(color) {
    document.body.style.backgroundColor = color;
}

oWebViewInterface.on('setBackgroundImage', function(image) {
    RE.setBackgroundImage(image);
});
RE.setBackgroundImage = function(image) {
    RE.editor.style.backgroundImage = image;
}

oWebViewInterface.on('setWidth', function(size) {
    RE.setWidth(size);
});
RE.setWidth = function(size) {
    RE.editor.style.minWidth = size;
}

oWebViewInterface.on('setHeight', function(size) {
    RE.setHeight(size);
});
RE.setHeight = function(size) {
    RE.editor.style.height = size;
}

oWebViewInterface.on('setMinHeight', function(size) {
    RE.setMinHeight(size);
});
RE.setMinHeight = function(size) {
    RE.editor.style.minHeight = size;
}

oWebViewInterface.on('setTextAlign', function(align) {
    RE.setTextAlign(align);
});
RE.setTextAlign = function(align) {
    RE.editor.style.textAlign = align;
}

oWebViewInterface.on('setVerticalAlign', function(align) {
    RE.setVerticalAlign(align);
});
RE.setVerticalAlign = function(align) {
    RE.editor.style.verticalAlign = align;
}

oWebViewInterface.on('setPlaceholder', function(placeholder) {
    RE.setPlaceholder(placeholder);
});
RE.setPlaceholder = function(placeholder) {
    RE.editor.setAttribute("placeholder", placeholder);
}

oWebViewInterface.on('setInputEnabled', function(inputEnabled) {
    RE.setInputEnabled(inputEnabled);
});
RE.setInputEnabled = function(inputEnabled) {
    RE.editor.contentEditable = String(inputEnabled);
}

oWebViewInterface.on('undo', function() {
    RE.undo();
});
RE.undo = function() {
    document.execCommand('undo', false, null);
}

oWebViewInterface.on('redo', function() {
    RE.redo();
});
RE.redo = function() {
    document.execCommand('redo', false, null);
}

oWebViewInterface.on('setBold', function() {
    RE.setBold();
});
RE.setBold = function() {
    document.execCommand('bold', false, null);
}

oWebViewInterface.on('setItalic', function() {
    RE.setItalic();
});
RE.setItalic = function() {
    document.execCommand('italic', false, null);
}

oWebViewInterface.on('setSubscript', function() {
    RE.setSubscript();
});
RE.setSubscript = function() {
    document.execCommand('subscript', false, null);
}

oWebViewInterface.on('setSuperscript', function() {
    RE.setSuperscript();
});
RE.setSuperscript = function() {
    document.execCommand('superscript', false, null);
}

oWebViewInterface.on('setStrikeThrough', function() {
    RE.setStrikeThrough();
});
RE.setStrikeThrough = function() {
    document.execCommand('strikeThrough', false, null);
}

oWebViewInterface.on('setUnderline', function() {
    RE.setUnderline();
});
RE.setUnderline = function() {
    document.execCommand('underline', false, null);
}

oWebViewInterface.on('setBullets', function() {
    RE.setBullets();
});
RE.setBullets = function() {
    document.execCommand('insertUnorderedList', false, null);
}

oWebViewInterface.on('setNumbers', function() {
    RE.setNumbers();
});
RE.setNumbers = function() {
    document.execCommand('insertOrderedList', false, null);
}

oWebViewInterface.on('setTextColor', function(color) {
    RE.setTextColor(color);
});
RE.setTextColor = function(color) {
    RE.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('foreColor', false, color);
    document.execCommand("styleWithCSS", null, false);
}

oWebViewInterface.on('setTextBackgroundColor', function(color) {
    RE.setTextBackgroundColor(color);
});
RE.setTextBackgroundColor = function(color) {
    RE.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('hiliteColor', false, color);
    document.execCommand("styleWithCSS", null, false);
}

oWebViewInterface.on('setFontSize', function(fontSize) {
    RE.setFontSize(fontSize);
});
RE.setFontSize = function(fontSize){
    document.execCommand("fontSize", false, fontSize);
}

oWebViewInterface.on('setHeading', function(heading) {
    RE.setHeading(heading);
});
RE.setHeading = function(heading) {
    document.execCommand('formatBlock', false, '<h'+heading+'>');
}

oWebViewInterface.on('setIndent', function() {
    RE.setIndent();
});
RE.setIndent = function() {
    document.execCommand('indent', false, null);
}

oWebViewInterface.on('setOutdent', function() {
    RE.setOutdent();
});
RE.setOutdent = function() {
    document.execCommand('outdent', false, null);
}

oWebViewInterface.on('setJustifyLeft', function() {
    RE.setJustifyLeft();
});
RE.setJustifyLeft = function() {
    document.execCommand('justifyLeft', false, null);
}

oWebViewInterface.on('setJustifyCenter', function() {
    RE.setJustifyCenter();
});
RE.setJustifyCenter = function() {
    document.execCommand('justifyCenter', false, null);
}

oWebViewInterface.on('setJustifyRight', function() {
    RE.setJustifyRight();
});
RE.setJustifyRight = function() {
    document.execCommand('justifyRight', false, null);
}

oWebViewInterface.on('setBlockquote', function() {
    RE.setBlockquote();
});
RE.setBlockquote = function() {
    document.execCommand('formatBlock', false, '<blockquote>');
}

oWebViewInterface.on('insertImage', function(url, alt) {
    RE.insertImage(url, alt);
});
RE.insertImage = function(url, alt) {
    var html = '<img src="' + url + '" alt="' + alt + '" />';
    RE.insertHTML(html);
}

oWebViewInterface.on('insertImageW', function(url, alt, width) {
    RE.insertImageW(url, alt, width);
});
RE.insertImageW = function(url, alt, width) {
    var html = '<img src="' + url + '" alt="' + alt + '" width="' + width + '"/>';
    RE.insertHTML(html);
}

oWebViewInterface.on('insertImageWH', function(url, alt, width, height) {
    RE.insertImageWH(url, alt, width, height);
});
RE.insertImageWH = function(url, alt, width, height) {
    var html = '<img src="' + url + '" alt="' + alt + '" width="' + width + '" height="' + height +'"/>';
    RE.insertHTML(html);
}

oWebViewInterface.on('insertVideo', function(url, alt) {
    RE.insertVideo(url, alt);
});
RE.insertVideo = function(url, alt) {
    var html = '<video src="' + url + '" controls></video><br>';
    RE.insertHTML(html);
}

RE.insertVideoW = function(url, width) {
    var html = '<video src="' + url + '" width="' + width + '" controls></video><br>';
    RE.insertHTML(html);
}

RE.insertVideoWH = function(url, width, height) {
    var html = '<video src="' + url + '" width="' + width + '" height="' + height + '" controls></video><br>';
    RE.insertHTML(html);
}

RE.insertAudio = function(url, alt) {
    var html = '<audio src="' + url + '" controls></audio><br>';
    RE.insertHTML(html);
}

RE.insertYoutubeVideo = function(url) {
    var html = '<iframe width="100%" height="100%" src="' + url + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br>'
    RE.insertHTML(html);
}

RE.insertYoutubeVideoW = function(url, width) {
    var html = '<iframe width="' + width + '" src="' + url + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br>'
    RE.insertHTML(html);
}

RE.insertYoutubeVideoWH = function(url, width, height) {
    var html = '<iframe width="' + width + '" height="' + height + '" src="' + url + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br>'
    RE.insertHTML(html);
}

oWebViewInterface.on('insertHTML', function(html) {
    RE.insertHTML(html);
});
RE.insertHTML = function(html) {
    RE.restorerange();
    document.execCommand('insertHTML', false, html);
}

oWebViewInterface.on('insertLink', function(url, title) {
    RE.insertLink(url, title);
});
RE.insertLink = function(url, title) {
    RE.restorerange();
    var sel = document.getSelection();
    if (sel.toString().length == 0) {
        document.execCommand("insertHTML",false,"<a href='"+url+"'>"+title+"</a>");
    } else if (sel.rangeCount) {
       var el = document.createElement("a");
       el.setAttribute("href", url);
       el.setAttribute("title", title);

       var range = sel.getRangeAt(0).cloneRange();
       range.surroundContents(el);
       sel.removeAllRanges();
       sel.addRange(range);
   }
    RE.callback();
}

oWebViewInterface.on('setTodo', function(text) {
    RE.setTodo(text);
});
RE.setTodo = function(text) {
    var html = '<input type="checkbox" name="'+ text +'" value="'+ text +'"/> &nbsp;';
    document.execCommand('insertHTML', false, html);
}

RE.prepareInsert = function() {
    RE.backuprange();
}

RE.backuprange = function(){
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
      var range = selection.getRangeAt(0);
      RE.currentSelection = {
          "startContainer": range.startContainer,
          "startOffset": range.startOffset,
          "endContainer": range.endContainer,
          "endOffset": range.endOffset};
        oWebViewInterface.emit('backuprange', RE.currentSelection);
    }
}

RE.restorerange = function(){
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.setStart(RE.currentSelection.startContainer, RE.currentSelection.startOffset);
    range.setEnd(RE.currentSelection.endContainer, RE.currentSelection.endOffset);
    selection.addRange(range);
}

RE.enabledEditingItems = function(e) {
    var items = [];
    if (document.queryCommandState('bold')) {
        items.push('bold');
    }
    if (document.queryCommandState('italic')) {
        items.push('italic');
    }
    if (document.queryCommandState('subscript')) {
        items.push('subscript');
    }
    if (document.queryCommandState('superscript')) {
        items.push('superscript');
    }
    if (document.queryCommandState('strikeThrough')) {
        items.push('strikeThrough');
    }
    if (document.queryCommandState('underline')) {
        items.push('underline');
    }
    if (document.queryCommandState('insertOrderedList')) {
        items.push('orderedList');
    }
    if (document.queryCommandState('insertUnorderedList')) {
        items.push('unorderedList');
    }
    if (document.queryCommandState('justifyCenter')) {
        items.push('justifyCenter');
    }
    if (document.queryCommandState('justifyFull')) {
        items.push('justifyFull');
    }
    if (document.queryCommandState('justifyLeft')) {
        items.push('justifyLeft');
    }
    if (document.queryCommandState('justifyRight')) {
        items.push('justifyRight');
    }
    if (document.queryCommandState('insertHorizontalRule')) {
        items.push('horizontalRule');
    }
    var formatBlock = document.queryCommandValue('formatBlock');
    if (formatBlock.length > 0) {
        items.push(formatBlock);
    }

    // window.location.href = "re-state://" + encodeURI(items.join(','));
    oWebViewInterface.emit('enabledEditingItems', document.queryCommandStat);
}

RE.focus = function() {
    var range = document.createRange();
    range.selectNodeContents(RE.editor);
    range.collapse(false);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    RE.editor.focus();
    oWebViewInterface.emit('focus', null);
}

RE.blurFocus = function() {
    RE.editor.blur();
    oWebViewInterface.emit('blurFocus', null);
}

RE.removeFormat = function() {
    document.execCommand('removeFormat', false, null);
    oWebViewInterface.emit('removeFormat', null);
}

// Event Listeners
RE.editor.addEventListener("input", RE.callback);
RE.editor.addEventListener("keyup", function(e) {
    var KEY_LEFT = 37, KEY_RIGHT = 39;
    if (e.which == KEY_LEFT || e.which == KEY_RIGHT) {
        RE.enabledEditingItems(e);
    }
});
RE.editor.addEventListener("click", RE.enabledEditingItems);

