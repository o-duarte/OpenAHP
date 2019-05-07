import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { withStyles } from '@material-ui/core/styles';

import {
  EditorState,
  //ContentState,
  getDefaultKeyBinding,
  KeyBindingUtil
} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import { convertToHTML, convertFromHTML } from 'draft-convert';

import createInlineToolbarPlugin, {
  Separator
} from 'draft-js-inline-toolbar-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from 'draft-js-buttons';

import 'draft-js-image-plugin/lib/plugin.css';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';

// Katex
import katex from 'katex';
import createKaTeXPlugin from 'draft-js-katex-plugin';

// First Block.
import { createFirstBlockTitlePlugin } from './plugins';

/*
 * Editor confing
 */

// First Block Title Plugin.
const firstBlockTitlePlugin = createFirstBlockTitlePlugin();

// Katex Plugin
const kaTeXPlugin = createKaTeXPlugin({
  katex,
  doneContent: { valid: 'Close', invalid: 'Invalid syntax' }
});

//const { InsertButton } = kaTeXPlugin;

const imagePlugin = createImagePlugin();

const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    HeadlineTwoButton,
    HeadlineThreeButton,
    Separator,
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton
  ]
});
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [
  kaTeXPlugin,
  inlineToolbarPlugin,
  imagePlugin,
  firstBlockTitlePlugin
];

const style = theme => ({
  editor: {
    boxSizing: 'border-box',
    cursor: 'text',
    margin: '60px 0',
    width: '100%'
  }
});

const styleMap = {
  unstyled: {
    fontFamily: '"Lora", serif',
    color: 'rgba(0, 0, 0, 0.72)',
    fontSize: '20px',
    display: 'block',
    fontStyle: 'normal',
    fontWeight: 300,
    lineHeight: '30px',
    margin: ' 0,0,30px,0',
    wordWrap: 'break-word',
    wordSpacing: '0.1em'
  }
};

class TextEditor extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.focus = this.focus.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);

    // custom functions.
    this.keyBindingFn = this.keyBindingFn.bind(this);
    this.blockStyleFn = this.blockStyleFn.bind(this);

    this.state = {
      editorState: EditorState.createWithContent(
        convertFromHTML(this.props.initialContent)
      )
    };
  }

  /*
   * custom functions.
   */

  blockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'unstyled') {
      return 'editor-paragraph';
    }
  }

  keyBindingFn(e) {
    const { hasCommandModifier } = KeyBindingUtil;

    if (e.keyCode === 83 && hasCommandModifier(e)) {
      return 'myeditor-save';
    }
    return getDefaultKeyBinding(e);
  }

  saveContent = debounce(content => {
    this.props.notificationCallback('Guardado');
    this.props.saveCallback({ html: convertToHTML(content), raw: content });
  }, 1000);

  /*
   * Handles functions.
   */

  handleKeyCommand(command, editorState) {
    if (command === 'myeditor-save') {
      return 'handled';
    }
    return 'not-handled';
  }

  onChange(editorState) {
    const newContent = editorState.getCurrentContent();
    const currentContent = this.state.editorState.getCurrentContent();

    // Saving content only when new state contains any text.
    if (currentContent !== newContent && newContent.hasText()) {
      this.props.notificationCallback('Guardando cambios...');
      this.saveContent(newContent);
    }

    this.setState({
      editorState
    });
  }

  focus() {
    this.editor.focus();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.editor} onClick={this.focus}>
        <Editor
          placeholder="Titulo del documento"
          editorState={this.state.editorState}
          onChange={this.onChange}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={this.keyBindingFn}
          blockStyleFn={this.blockStyleFn}
          customStyleMap={styleMap}
          plugins={plugins}
          ref={element => {
            this.editor = element;
          }}
        />
        <InlineToolbar />
      </div>
    );
  }
}

export default withStyles(style)(TextEditor);
