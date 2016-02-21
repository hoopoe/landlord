Paginator = (function() {

    var p = function(element, options) {
        this.element = element;


    };

    /*---Events---*/
    p.prototype.pageChanged = function(){

    };
    p.prototype.renderEnd = function() {
        
    };

    /*---Events---*/

    p.prototype.getElement = function(){
        return this.element;
    };
    /**
     * Sets the total number of items in the dataset
     */
    p.prototype.setTotalItems = function(num) {
        this.totalItems = num;
        return this;
    };

    /**
     * Returns the total number of items (or 0 if not defined)
     */
    p.prototype.getTotalItems = function() {
        return this.totalItems || 0;
    };

    /**
     * Sets the number of items per page
     */
    p.prototype.setItemsPerPage = function(num) {
        this.itemsPerPage = num;
        return this;
    };

    /**
     * Returns the number of items per page
     * Defaults to 10.
     */
    p.prototype.getItemsPerPage = function() {
        return this.itemsPerPage || 10;
    };

    /**
     * Sets an array to use as the dataset, for use with getItemsByPage() etc
     */
    p.prototype.setData = function(data) {
        this.setTotalItems(data.length);
        this.data = this.arrayToPageMap(data);

        this.currentPage = 1;

        return this;
    };

    p.prototype.indexOf = function(item){
        for (var pageNumber in this.data){
            var page = this.data[pageNumber];

            if (dojo.indexOf(page, item) !== -1){
                return (pageNumber - 1) * this.getItemsPerPage() + dojo.indexOf(page, item);
            }
        }
    };

    p.prototype.arrayToPageMap = function(data){
        var itemsPerPage = this.getItemsPerPage();
        var total = this.getNumberOfPages();
        var pageMap = {};

        for (var i = 1; i <= total; i++){
            pageMap[i] = data.slice(itemsPerPage * (i-1), itemsPerPage * i );
        }

        return pageMap;
    };

    p.prototype.setDataForPage = function(data, page) {
        //var offset = (page - 1) * this.getItemsPerPage();

        this.data[page] = data;

        return this;
    };

    /**
     * Sets the current page number
     */
    p.prototype.setCurrentPage = function(num, options) {
        options = options || {};

        this.currentPage = this.normalize(num);

        if (options.silent !== true){
            this.pageChanged(this.normalize(num));
        }

        return this;
    };

    /**
     * Returns the total number of pages
     */
    p.prototype.getNumberOfPages = function() {
        return Math.ceil(this.getTotalItems() / this.getItemsPerPage());
    };

    /**
     * Normalizes page number by making sure it is within the range of the paginator
     */
    p.prototype.normalize = function(num) {
        num = Math.max(parseInt(num, 10), 1);

        var pages = this.getNumberOfPages();
        if (pages > 0 && num > pages) {
            num = pages;
        }

        return num;
    };


    /**
     * Returns the given page of the dataset, or false if no data has been set
     */
    p.prototype.getItemsByPage = function(page) {
        page = this.normalize(page);

        return this.data[page];
        /*var offset = (page - 1) * this.getItemsPerPage();
        return this.data ? this.data.slice(offset, this.getItemsPerPage() * page) : false;*/
    };

    p.prototype.getItemByItemNumber = function(itemNumber) {
        var itemPage = Math.ceil(itemNumber / this.getItemsPerPage());
        var itemNumberInPage = itemNumber - ((itemPage -1 ) * this.getItemsPerPage()) - 1;

        if (this.data[itemPage]){
            return this.data[itemPage][itemNumberInPage];
        } else {
            return {};
        }
    };

    /**
     * Returns the current page of the dataset, or false if no data has been set
     */
    p.prototype.getCurrentItems = function() {
        return this.getItemsByPage(this.currentPage || 1);
    };

    /**
     * Sets page range (number of pages to show in pagination control)
     */
    p.prototype.setPageRange = function(num) {
        this.pageRange = num;
        return this;
    };

    /**
     * Returns the set page range (number of pages to show in pagination control)
     * Defaults to 5.
     */
    p.prototype.getPageRange = function() {
        return this.pageRange || 5;
    };

    /**
     * Creates an array containing the page numbers within the current range
     */
    p.prototype.getPagesInRange = function() {
        var pageRange = this.getPageRange();

        var pageNumber = this.currentPage || 1;
        var pageCount  = this.getNumberOfPages();

        if (pageRange > pageCount) {
            pageRange = pageCount;
        }

        var delta = Math.ceil(pageRange / 2), lowerBound, upperBound;

        if (pageNumber - delta > pageCount - pageRange) {
            lowerBound = pageCount - pageRange + 1;
            upperBound = pageCount;
        } else {
            if (pageNumber - delta < 0) {
                delta = pageNumber;
            }

            offset     = pageNumber - delta;
            lowerBound = offset + 1;
            upperBound = offset + pageRange;
        }

        lowerBound = this.normalize(lowerBound);
        upperBound = this.normalize(upperBound);

        var pages = [];
        for (pageNumber = lowerBound; pageNumber <= upperBound; pageNumber++) {
            pages.push(pageNumber);
        }
        return pages;
    };

    /**
     * Creates an object containing all the information needed to build a pagination control
     */
    p.prototype.getInfo = function() {
        var pageCount = this.getNumberOfPages();
        var current   = this.currentPage || 1;

        var info = {
            pageCount    : pageCount,
            itemsPerPage : this.getItemsPerPage(),
            totalItems   : this.getTotalItems(),
            current      : current,
            first        : 1,
            last         : pageCount
        };

        // Previous and next
        if (current - 1 > 0) {
            info.previous = current - 1;
        }

        if (current + 1 <= pageCount) {
            info.next = current + 1;
        }

        // Pages in range
        info.pagesInRange     = this.getPagesInRange();
        info.firstPageInRange = Math.min.apply(Math, info.pagesInRange);
        info.lastPageInRange  = Math.max.apply(Math, info.pagesInRange);

        return info;
    };

    /**
     * Build a URL based on the passed page and URL template
     *
     * Allowed template variables:
     *   {page}   - Replaced with the page number passed
     *   {limit}  - Replaced with the number of items per page
     *   {offset} - Replaced with the calculated offset for passed page number
     */
    p.prototype.getUrl = function(pageNum, url) {
        var page   = this.normalize(pageNum);
        var offset = (page - 1) * this.getItemsPerPage();
        var limit  = this.getItemsPerPage();
        return (url || '{page}').replace(/\{page\}/g, page).replace(/\{offset\}/g, offset).replace(/\{limit\}/g, limit);
    };

    p.prototype.setupEvents = function(){
        var self = this;

        var items = this.element.getElementsByTagName('li');

        for (var i = 0; i < items.length; i++){
            var pageElem = items[i];

            if (pageElem._handlers){
                for (var j in pageElem){
                    var handler = pageElem[j];
                    dojo.disconnect(handler);
                }
            }
            
            pageElem._handlers = [];

            pageElem._handlers.push(dojo.connect(pageElem, "onclick", function(){
                var el = this;
                var link = el.getElementsByTagName('a')[0];

                if (!dojo.hasClass(el, 'active')){
                    dojo.addClass(el, 'active');

                    self.setCurrentPage(parseInt(dojo.attr(link, 'data-page'), 10));
                    self.render();
                }
            }));
        }
    };

    /**
     * Creates HTML markup for a pagination control
     */
    p.prototype.render = function(options) {
        var pages = this.getInfo(), o = options || {};
        if (pages.pageCount <= 1) {
            this.element.innerHTML = '';
            return '';
        }

        dojo.addClass(this.element, "paginator");

        var html = ['']; //'<ul class="' + (o.paginatorClass || 'paginator') + '">'
        var pageItemTemplate = '<a href="javascript:void(0)" data-page="';//'<a href="javascript:void(0)" data-href="'

        if (pages.previous) {
            // "First"-link
            html.push(
                '<li class="', (o.firstClass || 'first'), '">',
                pageItemTemplate, this.getUrl(pages.first, o.url), '">', (o.firstText || '«'), '</a>',
                '</li>'
            );

            // "Previous"-link
            html.push(
                '<li class="', (o.prevClass || 'previous'), '">',
                pageItemTemplate, this.getUrl(pages.previous, o.url), '">', (o.prevText || '&larr;'), '</a>',
                '</li>'
            );
        }

        var page, active, i = 0;
        for (i = 0; i < pages.pagesInRange.length; i++) {
            page = pages.pagesInRange[i];
            active = (pages.current == page) ? ' class="' + (o.activeClass || 'active') + '"' : '';
            html.push('<li', active, '>',pageItemTemplate, this.getUrl(page, o.url), '">', page, '</a></li>');
        }

        if (pages.next) {
            // "Next"-link
            html.push(
                '<li class="', (o.nextClass || 'next'), '">',
                pageItemTemplate, this.getUrl(pages.next, o.url), '">', (o.prevText || '&rarr;'), '</a>',
                '</li>'
            );

            // "Last"-link
            html.push(
                '<li class="', (o.lastClass || 'last'), '">',
                pageItemTemplate, this.getUrl(pages.last, o.url), '">', (o.lastText || '»'), '</a>',
                '</li>'
            );
        }
        html.push('</ul>');

        this.element.innerHTML = html.join('');

        this.setupEvents();

        this.renderEnd(this);

        return this;
    };

    return p;

})();

function initSearchPagination(){
    var searchPagination = new Paginator(dojo.byId("resultListPages"));
    searchPagination.setItemsPerPage(20);
    searchPagination.setPageRange(5);

    dojo.connect(searchPagination, 'pageChanged', function(pageNumber){
        var features =  _searchPagination.getItemsByPage(pageNumber);


        if (features && features.length > 0){
            renderSearchList(features, _searchResultObjectsType);
        } else {
            if (_searchResultObjectsType == PortalObjectTypes.parcel || _searchResultObjectsType == PortalObjectTypes.oks){
                var searchedText = dojo.byId("searchTextbox").value.replace(/^\s+|\s+$/g, '');
                var dataToSend = { onlyAttributes: false, page: pageNumber};
                
                if (_identifyParcelsCadnums){
                    dataToSend.cadNumbers = _identifyParcelsCadnums;
                } else {
                    dataToSend.cadNumber = searchedText;
                }

                searchParcelObject(_searchResultObjectsType, dataToSend);
            }
        }
    });

    dojo.connect(searchPagination, 'renderEnd', function(){
        setTimeout(function () {
            resizeResultList();
        }, 0);
    });

    return searchPagination;
}



