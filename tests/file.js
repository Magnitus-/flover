var test = require('tape');
var flover = require('../index');
var R = require('ramda');

const file = flover.file;

['Id', 'Metadata', 'Title', 'Content', 'MimeType', 'Encoding', 'Md5', 'Group'].map((val) => {
    test(`Common tests: ${val}`, function (t) {
        t.plan(4);

        const get = file['get' + val];
        const set = file['set' + val];
        const over = file['over' + val];
    
        t.equal(
            R.compose(get, set(1))({}), 
            1,
            `file.set${val} and file.get${val} should set and get the file's ${val}`
        );
    
        t.equal(
            R.compose(get, over(R.multiply(3)), set(2))({}), 
            6,
            `file.over${val} should perform the passed function over the file's ${val}`
        );
    
        const _file = set(1, {});
    
        set(2, _file);
        t.equal(
            get(_file), 
            1,
            `file.set${val} should respect immutability`
        );
    
        over(R.multiply(3), _file);
        t.equal(
            get(_file), 
            1,
            `file.over${val} should respect immutability`
        );
    });
});

test('Particular tests: Title', function (t) {
    t.plan(2);

    var _file = file.setId('id', {});

    t.equal(
        file.getTitle(_file),
        'id',
        'file.getTitle should return the id when the title is not defined'
    );

    _file = file.setTitle('title', _file);

    t.equal(
        file.getTitle(_file),
        'title',
        'file.getTitle should return the title and not the id when the title is defined'
    );
})

