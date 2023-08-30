import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Color, Dialogs, LoadEventData, WebView, isIOS } from "@nativescript/core";
import { WebViewInterface } from 'nativescript-webview-interface';

@Component({
    selector: "ns-rich-text-editor",
    templateUrl: "rich-text-editor.component.html"
})

export class RichTextEditorComponent implements OnInit, OnDestroy {
    readonly MATCH_RGB_REGEX = "rgba?\\((\\d{1,3}), ?(\\d{1,3}), ?(\\d{1,3})\\)?(?:, ?(\\d(?:\\.\\d?))\\))?";
    keyBoardHeight = 0;
    oWebViewInterface: any;
    @ViewChild('webView', { static: true }) webView: ElementRef;
    constructor(private changeDetectorRef: ChangeDetectorRef) { }
    
    ngOnInit() {
        this.initWebView();
    }

    initWebView() {
        let webViewSrc = '~/assets/html/editor.html';
        let webviewN = this.webView.nativeElement;
        this.oWebViewInterface = new WebViewInterface(this.webView.nativeElement, webViewSrc);
        webviewN.on(WebView.loadStartedEvent, function (args: LoadEventData) {
            if (webviewN.android) {
                webviewN.android.setBackgroundColor(0x00000000);
                webviewN.android.getSettings().setBuiltInZoomControls(false);
                webviewN.android.setScrollContainer(false);

            } else {
                webviewN.ios.configuration.preferences.javaScriptEnabled = true;
                webviewN.ios.scrollView.minimumZoomScale = 1.0;
                webviewN.ios.scrollView.maximumZoomScale = 1.0;
                webviewN.ios.scalesPageToFit = true;

            }
        });

        webviewN.on(WebView.loadFinishedEvent, (args: LoadEventData) => {
            const webView = <WebView> args.object;
            if (!args.error) {

                if (isIOS) {
                  const placeholder = "Sharing feedback helps the community to get a better service and increase the awareness between people to get good quality.";
                  this.oWebViewInterface.emit(
                    "setHtml",
                    placeholder
                  );

                  this.oWebViewInterface.emit(
                    "setPlaceholder",
                    placeholder
                  );
                  webView.height =  200;
                  const jsStr = `var body = document.body;
                                var html = document.documentElement;
                                Math.max( body.scrollHeight, body.offsetHeight, 
                                html.clientHeight, html.scrollHeight, html.offsetHeight);`;
                 
                  webView.ios.evaluateJavaScriptCompletionHandler(
                    jsStr,
                    (result, error) => {
                      if (error) {
                        console.log("error...");
                      } else if (result) {
                        console.log('height ', result);
                        webView.height = result * 200;
                        webView.ios.scrollView.scrollEnabled = true;
                        this.changeDetectorRef.detectChanges();
                      }
                    }
                  );
                }

                this.oWebViewInterface.emit('setMinHeight', 200 + 'px');
                this.oWebViewInterface.emit('setFontSize', 20 + 'px');
                this.oWebViewInterface.emit('setPadding', 10 + 'px', 10+ 'px', 10+ 'px', 10+ 'px');

                this.oWebViewInterface.on('getHtml', (text) => {
                    console.log('getHtml ', text);
                });

                this.oWebViewInterface.on('re-callback', (event) => {
                    console.log('callback: ', event);
                });

                this.oWebViewInterface.on('getText', (event) => {
                    console.log('getText: ', event);
                });

                this.oWebViewInterface.on('backuprange', (event) => {
                    console.log('backuprange: ', event);
                });

                this.oWebViewInterface.on('enabledEditingItems', (event) => {
                    console.log('enabledEditingItems: ', event);
                });

                this.oWebViewInterface.on('focus', (event) => {
                    console.log('focus: ', event);
                });

                this.oWebViewInterface.on('blurFocus', (event) => {
                    console.log('blurFocus: ', event);
                });

                this.oWebViewInterface.on('removeFormat', (event) => {
                    console.log('removeFormat: ', event);
                });
            
            } else {
                console.log('error');
                console.dir(args.error)
            }

        });
    }

    insertLink(args) {
        Dialogs.prompt({title: 'Add Link', message: 'Please enter a valid web link',
        okButtonText: "Add", defaultText:'https://www.youtube.com/watch?v=cWGE9Gi0bB0',
        cancelButtonText: "Cancel"}).then(r => {
            console.log("Dialog result: " + r.result + ", text: " + r.text);
            if(r.result) {
                this.oWebViewInterface.emit('insertLink', r.text.split(',')[0], typeof r.text.split(',')[1] === 'undefined' || r.text.split(',')[1].length === 0 ? 'Web Link': r.text.split(',')[1].trim());
            }
        });
    }

    onUndo(args) {
        this.oWebViewInterface.emit('undo', null);
    }

    onRedo(args) {
        this.oWebViewInterface.emit('redo', null);
    }

    onBold(args) {
        this.oWebViewInterface.emit('setBold', null);
        this.toggleButton(args);
    }

    onItalic(args) {
        this.oWebViewInterface.emit('setItalic', null);
        this.toggleButton(args);
    }

    onSubscript(args, superscript) {
        this.oWebViewInterface.emit('setSubscript', null);
        this.toggleButton(args);
        this.toggleButtonOff(superscript);
    }

    onSuperscript(args, subscript) {
        this.oWebViewInterface.emit('setSuperscript', null);
        this.toggleButton(args);
        this.toggleButtonOff(subscript);
    }

    onStrikethrough(args) {
        this.oWebViewInterface.emit('setStrikeThrough', null);
        this.toggleButton(args);
    }

    onUnderline(args) {
        this.oWebViewInterface.emit('setUnderline', null);
        this.toggleButton(args);
    }

    onHeading1(args, ...headings: any[]) {
        this.oWebViewInterface.emit('setHeading', 1);
        this.toggleButton(args);
        for(const heading of headings) {
            this.toggleButtonOff(heading);
        }
    }


    onHeading2(args, ...headings: any[]) {
        this.oWebViewInterface.emit('setHeading', 2);
        this.toggleButton(args);
        for(const heading of headings) {
            this.toggleButtonOff(heading);
        }
    }

    onHeading3(args, ...headings: any[]) {
        this.oWebViewInterface.emit('setHeading', 3);
        this.toggleButton(args);
        for(const heading of headings) {
            this.toggleButtonOff(heading);
        }
    }

    onHeading4(args, ...headings: any[]) {
        this.oWebViewInterface.emit('setHeading', 4);
        this.toggleButton(args);
        for(const heading of headings) {
            this.toggleButtonOff(heading);
        }
    }

    onHeading5(args, ...headings: any[]) {
        this.oWebViewInterface.emit('setHeading', 5);
        this.toggleButton(args);
        for(const heading of headings) {
            this.toggleButtonOff(heading);
        }
    }

    onHeading6(args, ...headings: any[]) {
        this.oWebViewInterface.emit('setHeading', 6);
        this.toggleButton(args);
        for(const heading of headings) {
            this.toggleButtonOff(heading);
        }
    }

    onTxtColor(args) {
        // this.picker.show('#000000', 'ARGB').then((result: number) => {
        //     this.mEditor.setTextColor(android.graphics.Color.parseColor(new Color(result).hex));
        //     this.changeDetectionRef.detectChanges();
        // }).catch((err) => {
        //     console.log(err)
        // })
    }

    onBgColor(args) {
        // this.picker.show('#ffffff', 'ARGB').then((result: number) => {
        //     this.mEditor.setTextBackgroundColor(android.graphics.Color.parseColor(new Color(result).hex));
        //     this.changeDetectionRef.detectChanges();
        // }).catch((err) => {
        //     console.log(err)
        // })
    }

    onIndent(args, outdent) {
        this.oWebViewInterface.emit('setIndent', null);
        this.toggleButton(args);
        this.toggleButtonOff(outdent);
    }

    onOutdent(args, indent) {
        this.oWebViewInterface.emit('setOutdent', null);
        this.toggleButton(args);
        this.toggleButtonOff(indent);
    }

    onAlignLeft(args, ...alignements: any[]) {
        this.oWebViewInterface.emit('setAlignLeft', null);
        this.toggleButton(args);
        for(const alignement of alignements) {
            this.toggleButtonOff(alignement);
        }
    }

    onAlignCenter(args, ...alignements: any[]) {
        this.oWebViewInterface.emit('setAlignCenter', null);
        this.toggleButton(args);
        for(const alignement of alignements) {
            this.toggleButtonOff(alignement);
        }
    }


    onAlignRight(args, ...alignements: any[]) {
        this.oWebViewInterface.emit('setAlignRight', null);
        this.toggleButton(args);
        for(const alignement of alignements) {
            this.toggleButtonOff(alignement);
        }
    }

    onBlockquote(args) {
        this.oWebViewInterface.emit('setBlockquote', null);
    }

    onInsertBullets(args, insertNumbers) {
        this.oWebViewInterface.emit('setBullets', null);
        this.toggleButton(args);
        this.toggleButtonOff(insertNumbers);
    }

    onInsertNumbers(args, insertBullets) {
        this.oWebViewInterface.emit('setNumbers', null);
        this.toggleButton(args);
        this.toggleButtonOff(insertBullets);
    }


    onInsertImage(args) {
        Dialogs.prompt({title: 'Add Image Link', message: 'Please enter a valid web link',
        okButtonText: "Add", defaultText:'https://something../chip.jpg',
        cancelButtonText: "Cancel"}).then(r => {
            if(r.result) {
                this.oWebViewInterface.emit('insertImage', r.text, "image", 200);
            }
        });
    }


    onInsertYoutube(args) {
        Dialogs.prompt({title: 'Add Youtube Link', message: 'Please enter a valid Youtube link',
        okButtonText: "Add", defaultText:'https://www.youtube.com/watch?v=cWGE9Gi0bB0',
        cancelButtonText: "Cancel"}).then(r => {
            if(r.result) {
                this.oWebViewInterface.emit('insertYoutubeVideo', r.text, 200, 200);
            }
        });
    }


    onInsertAudio(args) {
        Dialogs.prompt({title: 'Add Audio Link', message: 'Please enter a valid web link',
        okButtonText: "Add", defaultText:'https://something../audio.mp3',
        cancelButtonText: "Cancel"}).then(r => {
            if(r.result) {
                this.oWebViewInterface.emit('insertAudio', r.text);
            }
        });
    }


    onInsertVideo(args) {
        Dialogs.prompt({title: 'Add Video Link', message: 'Please enter a valid web link',
        okButtonText: "Add", defaultText:'https://something../video.mp4',
        cancelButtonText: "Cancel"}).then(r => {
            if(r.result) {
                this.oWebViewInterface.emit('insertVideo', r.text, 200, 200);
            }
        });
    }


    onInsertCheckBox(args) {
        this.oWebViewInterface.emit('setTodo', 'checkbox');
    }

    toggleButton(args) {
        const image = args.object;
        if (image.get('active') === true) {
            image.backgroundColor = undefined;
            image.set('active', false);

        } else {
            image.backgroundColor = new Color('#e3a663');
            image.set('active', true);
        }
    }

    toggleButtonOff(image) {
        image.backgroundColor = undefined;
        image.set('active', false);
    }
    
    fixColors(text: string) {
        let match =  text.match(this.MATCH_RGB_REGEX);
        while(match !== null) {
            const hex = this.rgbToHex(Number(match[1]), Number(match[2]), Number(match[3]));
            text = text.replace(match[0], hex);
            match =  text.match(this.MATCH_RGB_REGEX);
        }
        return text;
    }

    componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
    }
}

