import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { AbsoluteLayout, CoreTypes, EventData, GridLayout, Label, ListView, Page, Screen, Size, TextField, getRootLayout } from "@nativescript/core";
import { Point } from "@nativescript/core/ui/core/view";

@Component({
    selector: "Dropdown",
    templateUrl: "drop-down.component.html"
})
export class DropDownComponent implements OnInit, AfterViewInit, OnDestroy {

    _backdrop: AbsoluteLayout;
    BACKDROP_ID = 'mdlBackdrop;'
    _listPicker: ListView;

    @Input() rowHeight = 44;
    @Input() textEnabled = true;
    @Input() items: any = [{ label: 'first' }, { label: 'second' }, { label: 'third' }, { label: 'forth' }, { label: 'fifth' },
    { label: 'sixth' }, { label: 'seventh' }, { label: 'eighth' }, { label: 'nineth' }, { label: 'tenth' }];
    @Input('selected') selected: number = -1;
    @Output() onItemSelect: EventEmitter<any> = new EventEmitter();
    isActive = false;
    selectionTriggered = false;
    isFiltered = false;
    filtered: any[] = [];

    @Input('itemTemplate') itemTemplate: string = `<StackLayout ><Label text='{{label}}'></Label></StackLayout>`;


    @ViewChild("dropDownText", { static: true }) dropDownTextLabel: ElementRef;
    @ViewChild("dropDownIcon", { static: true }) dropDownIconRef: ElementRef;


    @ViewChild("selectedItemView", { static: true }) selectedViewRef: ElementRef;

    dropDownText: TextField;
    dropDownIcon: Label;

    selectedView: GridLayout;



    public constructor(
        public readonly page: Page
    ) {
        this.page.on("unloaded", this.onUnloaded, this);
    }

    public ngOnInit() {

        this.selectedView = <GridLayout>this.selectedViewRef.nativeElement;

        this.dropDownIcon = <Label>this.dropDownIconRef.nativeElement;
        this.dropDownText = <TextField>this.dropDownTextLabel.nativeElement;
        if (this.selected > -1) {
            this.dropDownText.text = this.items[this.selected].label;
        }
    }

    ngAfterViewInit(): void {
    }


    onTap(args) {
        const label = <Label>args.object;
        this.isActive = !this.isActive;
        if (this.isActive) {
            label.text = String.fromCharCode(61804);
            this.expandList();
        } else {
            label.text = String.fromCharCode(61797);
            this.closeList();
        }
    }

    private _positionListPicker() {
        if (!this._listPicker) {
            console.error(`list picker must be instantiated before calculating its position`);
            return null;
        }

        let srcLocation: Point = this.selectedView.getLocationOnScreen();
        let selectedItemViewSize: Size = this.selectedView.getActualSize();
        let x: number = 0;
        let y: number = 0;
        let maxX: number = Math.min(
            Screen.mainScreen.widthDIPs,
            selectedItemViewSize.width - srcLocation.x
        );
        let maxY: number = Math.min(
            Screen.mainScreen.heightDIPs,
            selectedItemViewSize.height - 0
        );



        //make sure neither x nor y are < 0
        x = Math.max(0, x);
        y = Math.max(0, y);
        if (this.rowHeight < 44) {
            this.rowHeight = 44;
        }

        //Need to set width as it's dynamic and is used in calculating if we're outside max bounds
        this._listPicker.width = Math.max(selectedItemViewSize.width, Number(this._listPicker.getActualSize().width));
        this._listPicker.height = this.rowHeight * 3;
        if (this._listPicker.getActualSize().height > 200) {
            this._listPicker.height = 200;
        }
        // console.log(this._listPicker.getActualSize().height, this._listPicker.getMeasuredHeight(), selectedItemViewSize.height, this.page.getActualSize().height - srcLocation.y);
        // this._listPicker.translateX = x;
        // this._listPicker.translateY = - this.selectedView.getMeasuredHeight() - 50;
        this._listPicker.left = srcLocation.x;
        if (this.page.getActualSize().height - srcLocation.y < this.rowHeight * 3) {
            if (srcLocation.y > this.page.getActualSize().height / 2) { // bottom section
                console.log('bottom section');
                // this._listPicker.top = srcLocation.y - (this.page.getActualSize().height - srcLocation.y + selectedItemViewSize.height);// 127;
                this._listPicker.top = srcLocation.y - (this.rowHeight * 3.6);
            } else { //top section
                console.log('top section');
                this._listPicker.top = srcLocation.y + (this.page.getActualSize().height - srcLocation.y + selectedItemViewSize.height); // 127;
            }
        } else {
            this._listPicker.top = srcLocation.y + (selectedItemViewSize.height * 0.5); // + this.selectedView.getMeasuredHeight();




            // console.log(this._listPicker.top - srcLocation.y);
            // if(Math.abs(this._listPicker.top - srcLocation.y) >= 20) {
            //     this._listPicker.top = srcLocation.y;
            // }
        }

        //if wide enough to go off screen or if tall enough to go off screen, handle
        let totalX: number = x + this._listPicker.getActualSize().width, totalY: number = y + this._listPicker.getActualSize().height;

        if (totalX > maxX) {
            this._listPicker.translateX = Math.max(
                0,
                x - (totalX - maxX)
            );
        }

        if (totalY > maxY) {
            this._listPicker.translateY = Math.max(
                0,
                y - Number(this._listPicker.getActualSize().height) +
                selectedItemViewSize.height
            );
        }
    }

    public expandList() {
        console.log('expandList......');

        if (typeof this._backdrop === 'undefined') {
            this._backdrop = new AbsoluteLayout();
            this._backdrop.id = 'backdrop';
            this._backdrop.visibility = CoreTypes.Visibility.collapse;

            this._backdrop.on('tap', this.closeList, this);
        }

        this._backdrop.height = this.page.height;
        this._backdrop.width = this.page.width;
        this._backdrop.visibility = CoreTypes.Visibility.visible;
        console.log('custom view');

        getRootLayout().open(this._backdrop)
            .catch(ex => console.error(ex));


        if (!this._listPicker) {
            this._listPicker = new ListView();
            this._listPicker.on(ListView.loadedEvent, () => {
                console.log('list loaded');
                this._positionListPicker();
            });

            this._listPicker.on(ListView.itemTapEvent,
                (args: any) => {
                    console.log('itemTapEvent');
                    if (this.isFiltered) {
                        const selected = this.filtered[args.index];
                        this.dropDownText.text = selected.label;
                        this.isFiltered = false;
                        this.onItemSelect.emit(selected);
                    } else {
                        const selected = this.items[args.index];
                        this.dropDownText.text = selected.label;
                        this.onItemSelect.emit(selected);
                    }
                    this.selectionTriggered = true;
                    this.closeList();
                });

            this._listPicker.on(ListView.loadMoreItemsEvent,
                (arg: EventData) => {
                    console.log('loadMoreItemsEvent...');
                });

            this._listPicker.id = '1_pickerList';
            this._listPicker.visibility = CoreTypes.Visibility.visible;
            this._listPicker.className = 'defaultbg';


            this._backdrop.addChild(this._listPicker);

            this._listPicker.items = this.items;

            this._listPicker.itemTemplate = this.itemTemplate;
        }
        if (!this.isFiltered) {
            this._listPicker.items = this.items;
        }
        this._listPicker.refresh();



        // if (typeof this.selectedIndex !== 'undefined') {
        //     this._listPicker.scrollToIndex(this.selectedIndex);
        // }
        this._listPicker.opacity = 0;

        this._listPicker.animate({
            opacity: 1,
            duration: 300
        });
    }

    filterSelections(args: EventData) {
        if (this.selectionTriggered) {
            this.selectionTriggered = false;
            return;
        }
        const text = (<TextField>args.object).text;
        this.filtered = this.items.filter(item => item.label.toLocaleLowerCase().includes(text.toLocaleLowerCase()));
        if (!this.isActive) {
            this.isActive = true;
            this.dropDownIcon.text = String.fromCharCode(61804);
            this.expandList();
        }
        this._listPicker.items = this.filtered;
        this.isFiltered = true;
        this._listPicker.refresh();
    }

    onReturnPress(args: any) {
        let textField = <TextField>args.object;
        if (textField.returnKeyType === 'done') {
            console.log('enter key');
        }
    }

    public closeList() {
        console.log('closeList......');
        this.isActive = false;
        this.dropDownIcon.text = String.fromCharCode(61797);
        this._listPicker.animate({
            opacity: 0,
            duration: 300
        }).then(() => {
            this._backdrop.visibility = CoreTypes.Visibility.collapse;
            this._listPicker.opacity = 0;
        });
        getRootLayout()
            .close(this._backdrop)
            .catch(ex => console.error(ex));
    }

    public onUnloaded() {
        if (this.isActive) {
            this.closeList();
        }
    }

    ngOnDestroy(): void {
        if (this.isActive) {
            this.closeList();
        }
    }


}