#!/usr/bin/env python
# -*- coding: utf-8 -*-
# vim: et sw=4 ts=4

import os, sys, re, simplejson, shutil, logging, logging.config, time, datetime, urllib, pprint, codecs, subprocess
from sets import Set

try:
    logging.config.fileConfig(os.path.join(sys.path[0], 'log.conf'))
except:
    pass

log = logging.getLogger('meta.join')

class MetaJoin(object):

    def __init__(self):

        # SRC_DIR        = '/Users/adamoore/src/yui3/src/'
        SRC_DIR        = '../'
        SRC_SUBDIR     = 'meta'
        SRC_EXT        = 'json'

        TEMPLATE_DIR   = 'template'
        TEMPLATE_FILE  = 'meta.js'
        TEMPLATE_TOKEN = '{ // METAGEN }' 

        DEST_DIR       = 'js'
        DEST_JSON      = 'modules.json'
        DEST_JS        = 'meta.js'

        src_path       = os.path.abspath(SRC_DIR)

        print src_path

        template_path  = os.path.abspath(TEMPLATE_DIR)
        dest_path      = os.path.abspath(DEST_DIR)

        if not os.path.exists(dest_path):         
            os.mkdir(dest_path)

        print dest_path

        def readFile(path, file):
            return codecs.open(os.path.join(path, file), "r", "utf-8").read()

        def pp(msg):
            log.info(pprint.pformat(data))

        modules = {}

        for i in os.listdir(src_path):
            # module director
            dirname = os.path.join(src_path, i)
            print dirname
            if os.path.isdir(dirname):
                # meta dir
                metadir = os.path.join(dirname, SRC_SUBDIR)
                if os.path.isdir(metadir):
                    for j in os.listdir(metadir):
                        print j
                        # read all [component].json files
                        if j.endswith(SRC_EXT):
                            string_data = readFile(metadir, j)
                            data = simplejson.loads(string_data)
                            # print simplejson.dumps(data, ensure_ascii=False, sort_keys=True, indent=4)
                            for k, v in data.iteritems():
                                modules[k] = v


        jsonstr = simplejson.dumps(modules, ensure_ascii=False, sort_keys=True, indent=4)
        print jsonstr

        jsstr = readFile(template_path, TEMPLATE_FILE)
        jsstr.replace(TEMPLATE_TOKEN, jsonstr)

        # write the raw module json
        out = codecs.open(os.path.join(dest_path, DEST_JSON), 'w', 'utf-8')
        out.writelines(jsonstr)
        out.close()

        # create the meta.js file from a template
        out = codecs.open(os.path.join(dest_path, DEST_JS), 'w', 'utf-8')
        out.writelines(jsstr)
        out.close()
            
        log.info('end) done')

def main():
    metagen = MetaJoin()

if __name__ == '__main__':
    main()
