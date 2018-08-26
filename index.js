const R = require('ramda');
const { lensToProperties } = require('ramda-lens-converter');

const isDefined = R.compose(R.not, R.identical(undefined));
const emptyObj = () => {return {}};

const fileLenses = {
    'id': R.lensProp('id'),
    'metadata': R.lensProp('metadata'),
    'title': R.lens(
        R.ifElse(R.has('title'), R.prop('title'), R.prop('id')),
        R.assoc('title')
    ),
    'content': R.lensProp('content'),
    'mimeType': R.lensProp('mimeType'),
    'encoding': R.lensProp('encoding'),
    'md5': R.lensProp('md5'),
    'group': R.lensProp('group')
}

const _filesGroupId = {
    get: R.path(['group', 'id']),
    set: R.assocPath(['group', 'id'])
};

const setFilesGroupFiles = R.curry((files, filesGroup) => {
    const id = _filesGroupId.get(filesGroup);
    return R.ifElse(
        R.pathSatisfies(isDefined, ['group', 'id']),
        R.assoc(
            'files',
            R.map(
                R.set(fileLenses.group, id),
                files
            )
        ),
        R.assoc(
            'files',
            files
        )
    )(filesGroup);
});

const setFilesGroupId = R.curry((id, filesGroup) => {
    return R.compose(
        R.when(
            R.has('files'),
            R.over(
                R.lensProp('files'),
                R.map(R.set(fileLenses.group, id))
            )
        ),
        _filesGroupId.set(id)
    )(filesGroup);
})

const filesGroupLenses = {
    'id': R.lens(
        _filesGroupId.get,
        setFilesGroupId
    ),
    'matchOn': R.lensPath(['group', 'matchOn']),
    'duplicationThreshold': R.lens(
        R.pathOr(1, ['group', 'duplicationThreshold']),
        R.assocPath(['group', 'duplicationThreshold'])
    ),
    'metadata': R.lens(
        //Cannot use pathOr, as the default value would become a global reference to an object
        R.compose(R.unless(isDefined, emptyObj), R.path(['group', 'metadata'])),
        R.assocPath(['group', 'metadata'])
    ),
    'timestamp': R.lensPath(['group', 'timestamp']),
    'files': R.lens(
        R.prop('files'),
        setFilesGroupFiles
    )
}

const filesGroup = R.merge(
    lensToProperties(filesGroupLenses),
    {
        getMetadataKey: R.curry((key, obj) => {
            return R.compose(R.prop(key), R.view(filesGroupLenses.metadata))(obj);
        })
    }
)

module.exports = {
    file: lensToProperties(fileLenses),
    filesGroup
}
