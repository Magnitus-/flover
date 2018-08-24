# Overview

Short for 'File Lover', Flover is a open solution to archive/backup files of any kind (though it is biased toward binary-like files and doesn't contain a mechanism to only store differentials so constantly evolving text files, like code for example, are best stored in a version control system like Git)

The core idea is to decouple the components of a file storage solution (backend API, storage plugin, model, client), provide a clear contract between components and enough flexibility that various kinds of files can be stored.

This repo will contain the javascript model and the specs for the contracts between the components.

As I'm currently implementing an API backend for it with Express and a storage plugin with MongoDB/GridFS, consider this very much a work in progress.

# Model

The model for Flover has 2 entities:
- Files: Self-descriptive
- Files Groups: A logical grouping of associated files (could be the songs of an album, the various formats of an ebook, whatever grouping makes sense really)

## Design Notes

Ramda lenses are used by the model and all setters in the model respect the rules of immutability (meaning that they don't modify data structures inplace, but rather return a copy of the passed data structure with the changes applied to it).

Also, there are no constructors. You can always start with an empty object (ie, {}) and compose the various setters of the model to obtain a fully populated data structure.

Many of the data types you can pass to the model (for example, ids) are deliberately flexible in order not to discriminate against a particular storage or API solution.

When you define values to pass to the model, you should stick with native js types (no classes) in order to keep the data easily serializable in JSON. If you need a class for a particular component (ex: MongoDB ObjectID for a MongoDB storage plugin), you should apply a translation layer at the boundary of that component in order to keep the usage of the class scoped to that component.

## Files

The file model contains the following functions:

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

```
getId(file)
setId(id, file)
overId(fn, file)
```

These functions get, set or apply a custom function over the file's id. The id should be a unique identifier for the file.

```
getMetadata(file)
setMetadata(metadata, file)
overMetadata(fn, file)
```

These functions get, set or apply a custom function over the file's metadata. The metadata should be an object containing various properties of the file. 

The exact structure of the object is up to the user, with the caveat that it should be compatible with the storage plugin that is used. A flat set of key-values is recommended for maximum compatibility.

```
getTitle(file)
setTitle(file)
overTitle(file)
```

These functions get, set or apply a custom function over the file's title. Note that if the file's title is not defined, but the file's id is defined, the id will be returned by the getter instead.

## Methods