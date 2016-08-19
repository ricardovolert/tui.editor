'use strict';

var RemoveRow = require('../../src/js/wysiwygCommands/tableRemoveRow'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager'),
    WwTableManager = require('../../src/js/wwTableManager'),
    WwTableSelectionManager = require('../../src/js/wwTableSelectionManager');

describe('Table - RemoveRow', function() {
    var wwe;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();
        wwe.addManager('table', WwTableManager);
        wwe.addManager('tableSelection', WwTableSelectionManager);
        wwe.getEditor().focus();
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('remove row that have selected cell', function() {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange();

        sq.setHTML([
            '<table>',
                '<thead>',
                    '<tr><th>1</th><th>2</th></tr>',
                '</thead>',
                '<tbody>',
                    '<tr><td class="te-cell-selected">3</td><td>4</td></tr>',
                    '<tr><td>5</td><td>6</td></tr>',
                '</tbody>',
            '</table>'
        ].join('\n'));

        range.setStartAfter(wwe.get$Body().find('tbody td')[0].firstChild);
        range.collapse(true);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        RemoveRow.exec(wwe);

        expect(wwe.get$Body().find('tbody tr').length).toEqual(1);
        expect(wwe.get$Body().find('tbody td').length).toEqual(2);
    });

    it('dont remove row if there have only one row', function() {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange();

        sq.setHTML([
            '<table>',
                '<thead>',
                    '<tr><th>1</th><th>2</th></tr>',
                '</thead>',
                '<tbody>',
                    '<tr><td class="te-cell-selected">3</td><td>4</td></tr>',
                '</tbody>',
            '</table>'
        ].join('\n'));

        range.setStartAfter(wwe.get$Body().find('tbody td')[0].firstChild);
        range.collapse(true);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        RemoveRow.exec(wwe);

        expect(wwe.get$Body().find('tbody tr').length).toEqual(1);
        expect(wwe.get$Body().find('tbody td').length).toEqual(2);
    });

    it('focus to next row\'s first td', function() {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange();

        sq.setHTML([
            '<table>',
                '<thead>',
                    '<tr><th>1</th><th>2</th></tr>',
                '</thead>',
                '<tbody>',
                    '<tr><td class="te-cell-selected">3</td><td>4</td></tr>',
                    '<tr><td>5</td><td>6</td></tr>',
                '</tbody>',
            '</table>'
        ].join('\n'));

        range.setStartAfter(wwe.get$Body().find('tbody td')[0].firstChild);
        range.collapse(true);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        RemoveRow.exec(wwe);

        expect(sq.getSelection().startContainer.textContent).toBe(wwe.get$Body().find('tbody td')[0].textContent);
    });

    it('focus to prev row\'s first td if it doesn\'t have next row', function() {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange();

        sq.setHTML([
            '<table>',
                '<thead>',
                    '<tr><th>1</th><th>2</th></tr>',
                '</thead>',
                '<tbody>',
                    '<tr><td>3</td><td>4</td></tr>',
                    '<tr><td class="te-cell-selected">5</td><td>6</td></tr>',
                '</tbody>',
            '</table>'
        ].join('\n'));

        range.setStartAfter(wwe.get$Body().find('tbody td')[2].firstChild);
        range.collapse(true);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        RemoveRow.exec(wwe);

        expect(sq.getSelection().startContainer.textContent).toEqual(wwe.get$Body().find('tbody td')[0].textContent);
    });

    it('remove rows that have selected', function() {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange();

        sq.setHTML([
            '<table>',
            '<thead>',
            '<tr><th>1</th><th>2</th></tr>',
            '</thead>',
            '<tbody>',
            '<tr><td class="te-cell-selected">3</td><td class="te-cell-selected">4</td></tr>',
            '<tr><td class="te-cell-selected">5</td><td class="te-cell-selected">6</td></tr>',
            '<tr><td class="te-cell-selected">7</td><td>8</td></tr>',
            '<tr><td>9</td><td>10</td></tr>',
            '</tbody>',
            '</table>'
        ].join('\n'));

        range.setStartAfter(wwe.get$Body().find('tbody td')[0].firstChild);
        range.setEndAfter(wwe.get$Body().find('tbody td')[4].firstChild);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        RemoveRow.exec(wwe);

        expect(wwe.get$Body().find('tbody tr').length).toEqual(1);
        expect(wwe.get$Body().find('tbody td').length).toEqual(2);
    });

    it('do not remove table header', function() {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange();

        sq.setHTML([
            '<table>',
            '<thead>',
            '<tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr>',
            '</thead>',
            '<tbody>',
            '<tr><td>3</td><td>4</td></tr>',
            '<tr><td>5</td><td>6</td></tr>',
            '<tr><td>7</td><td>8</td></tr>',
            '<tr><td>9</td><td>10</td></tr>',
            '</tbody>',
            '</table>'
        ].join('\n'));

        range.setStartAfter(wwe.get$Body().find('thead th')[0].firstChild);
        range.setEndAfter(wwe.get$Body().find('thead th')[1].firstChild);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        RemoveRow.exec(wwe);

        expect(wwe.get$Body().find('thead tr').length).toEqual(1);
        expect(wwe.get$Body().find('tbody tr').length).toEqual(4);
    });

    it('do not remove last row', function() {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange();

        sq.setHTML([
            '<table>',
            '<thead>',
            '<tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr>',
            '</thead>',
            '<tbody>',
            '<tr><td class="te-cell-selected">3</td><td class="te-cell-selected">4</td></tr>',
            '<tr><td class="te-cell-selected">5</td><td class="te-cell-selected">6</td></tr>',
            '<tr><td class="te-cell-selected">7</td><td class="te-cell-selected">8</td></tr>',
            '<tr><td class="te-cell-selected">9</td><td class="te-cell-selected">10</td></tr>',
            '</tbody>',
            '</table>'
        ].join('\n'));

        range.setStartAfter(wwe.get$Body().find('thead th')[0].firstChild);
        range.setEndAfter(wwe.get$Body().find('tbody td')[7].firstChild);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        RemoveRow.exec(wwe);

        expect(wwe.get$Body().find('thead tr').length).toEqual(1);
        expect(wwe.get$Body().find('tbody tr').length).toEqual(1);
        expect(wwe.get$Body().find('tbody tr').last().text()).toEqual('910');
    });
});