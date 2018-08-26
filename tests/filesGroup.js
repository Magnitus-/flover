var test = require('tape');
var flover = require('../index');
var R = require('ramda');

const file = flover.file;
const filesGroup = flover.filesGroup;

test('Test id', function (t) {
    t.plan(3);

    t.equal(
        R.compose(
            filesGroup.getId,
            filesGroup.overId(R.multiply(2)),
            filesGroup.setId(1)
        )({}),
        2,
        "Basic fonctionality of getter, setter and over should work as expected"
    )

    var group = R.compose(
        filesGroup.overId(R.multiply(2)),
        filesGroup.setId(1),
        filesGroup.setFiles([{}, {}, {}])
    )({});

    t.ok(
        R.compose(
            R.all(
                R.compose(R.equals(2), file.getGroup)
            ),
            filesGroup.getFiles
        )(group),
        "Id setters of filesGroup should be passed down to files"
    )

    filesGroup.overId(R.multiply(2), group);

    t.ok(
        R.and(
            R.compose(
                R.all(
                    R.compose(R.equals(2), file.getGroup)
                ),
                filesGroup.getFiles
            ),
            R.compose(
                R.equals(2),
                filesGroup.getId
            )
        )(group),
        "Id setters should respect immutability"
    )
});

test('Test matchOn', function (t) {
    t.plan(2);
    t.ok(
        R.equals(
            R.compose(
                filesGroup.getMatchOn,
                filesGroup.overMatchOn(R.append('maybe')),
                filesGroup.setMatchOn(['yes', 'no'])
            )({}),
            ['yes', 'no', 'maybe']
        ),
        "Ensure getter, setter and over work as expected"
    )

    var group = filesGroup.setMatchOn(['yes', 'no'], {});
    filesGroup.overMatchOn(R.append('maybe'), group);
    t.ok(
        R.equals(
            filesGroup.getMatchOn(group),
            ['yes', 'no']
        ),
        "matchOn setters should respect immutability"
    );
});

test('Test duplicationThreshold', function(t) {
    t.plan(3);

    t.equal(
        filesGroup.getDuplicationThreshold({}),
        1,
        "Getter should return 1 when duplication threshold is undefined"
    );

    t.equal(
        R.compose(
            filesGroup.getDuplicationThreshold,
            filesGroup.overDuplicationThreshold(R.multiply(2)),
            filesGroup.setDuplicationThreshold(3)
        )({}),
        6,
        "The getter, setter and over should work as expected"
    );

    var group = filesGroup.setDuplicationThreshold(2, {});
    filesGroup.overDuplicationThreshold(R.multiply(2), group);
    t.equal(
        filesGroup.getDuplicationThreshold(group),
        2,
        "Setters should respect immutability"
    );

});

test('Test metadata', function(t) {
    t.plan(3);

    t.ok(
        R.equals(
            filesGroup.getMetadata({}),
            {}
        ),
        "The getter should return an empty object when metadata is undefined"
    );

    t.ok(
        R.equals(
            R.compose(
                filesGroup.getMetadata,
                filesGroup.overMetadata(R.assoc('b', 2)),
                filesGroup.setMetadata({'a': 1})
            )({}),
            {'a': 1, 'b': 2},
        ),
        "The getter, setter and over should work as expected"
    );

    var group = filesGroup.setMetadata({'a': 1}, {});
    filesGroup.overMetadata(R.assoc('b', 2), group);

    t.ok(
        R.equals(
            filesGroup.getMetadata(group),
            {'a': 1}
        ),
        "The setters should respect immutability"
    );

});

test('Test timestamp', function(t) {
    t.plan(0);
    t.end();
});

test('Test files', function(t) {
    t.plan(0);
    t.end();
});

test('Test getMetadataKey', function(t) {
    t.plan(0);
    t.end();
});