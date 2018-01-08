const R = require('ramda');
const { lensToProperties } = require('ramda-lens-converter');

const fileLenses = {
    'id': R.lensProp('id'),
    'metadata': R.lensProp('metadata'),
    'title': R.lens(
        R.ifElse(R.has('title'), R.prop('title'), R.prop('id')),
        R.assoc('title')
    ),
    'mimeType': R.lensProp('mimeType'),
    'encoding': R.lensProp('encoding'),
    'md5': R.lensProp('md5'),
    'group': R.lensProp('group')
}


const setFileGroupFiles = R.curry((files, filesGroup) => {
    const id = R.path(['group', 'id'], filesGroup);
    return R.assoc(
        'files',
        R.map(
            R.set(fileLenses.group, id),
            files
        ),
        filesGroup
    );
});

const setFileGroupId = R.curry((id, filesGroup) => {
    return R.compose(
        R.ifElse(
            R.has('files'),
            R.over(
                R.lensProp('files'),
                R.map(R.set(fileLenses.group, id))
            ),
            R.identity
        ),
        R.assocPath(['group', 'id'], id)
    )(filesGroup);
})

const filesGroupLenses = {
    'id': R.lens(
        R.path(['group', 'id']),
        setFileGroupId
    ),
    'matchOn': R.lensPath(['group', 'matchOn']),
    'duplicationThreshold': R.lens(
        R.pathOr(1, ['group', 'duplicationThreshold']),
        R.assocPath(['group', 'duplicationThreshold'])
    ),
    'metadata': R.lensPath(['group', 'metadata']),
    'files': R.lens(
        R.props('files'),
        setFileGroupFiles
    )
}

module.exports = {
    file: lensToProperties(fileLenses),
    filesGroup: lensToProperties(filesGroupLenses)
}
