import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as monaco from 'monaco-editor';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { users } from '../../../constants';
import { User } from '../../common/models/user';

@Component({
  selector: 'app-editor-component',
  standalone: true,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('editorContainer', { static: true })
  editorContainer!: ElementRef<HTMLDivElement>;

  @Input() code = '';
  @Input() language = 'javascript';
  @Input() roomId = '';
  @Input() webSocketServer = '';
  @Input() user?: User;

  private editor!: monaco.editor.IStandaloneCodeEditor;
  private ydoc = new Y.Doc();
  private provider!: WebsocketProvider;

  private isRenderingDecorations = false;
  private pendingRender = false;

  private cursorDecorations: string[] = [];
  userName: string = "";

  ngOnInit() {
    if (this.provider) return;
    this.userName = this.user?.name ?? "";
    this.provider = new WebsocketProvider(
      this.webSocketServer,
      this.roomId,
      this.ydoc
    );

    this.provider.awareness.setLocalState({
      user: this.user
    });

    this.provider.awareness.on('change', (state: any) => {
      const localClientId = this.provider.awareness.clientID;
      const { added, removed, updated } = state;
      const isLocalChange = [...added, ...removed, ...updated].some(id => id === localClientId);
      if (isLocalChange) return;
      this.scheduleRemoteCursorRender();
    });

    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  ngAfterViewInit() {
    const yText = this.ydoc.getText('monaco');

    this.editor = monaco.editor.create(
      this.editorContainer.nativeElement,
      {
        value: this.code,
        language: this.language,
        theme: 'vs-dark',
        automaticLayout: true
      }
    );

    this.editor.onDidChangeCursorSelection(e => {
      const { selection } = e;
      this.provider.awareness.setLocalStateField('cursor', {
        start: selection.getStartPosition(),
        end: selection.getEndPosition()
      })
    })

    this.editor.onDidFocusEditorText(() => {
      this.provider.awareness.setLocalStateField('focus', true);
    });

    this.editor.onDidBlurEditorText(() => {
      this.provider.awareness.setLocalStateField('focus', false);
    });

    new MonacoBinding(
      yText,
      this.editor.getModel()!,
      new Set([this.editor])
    );
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);

    this.provider?.awareness.setLocalState(null);
    this.provider?.destroy();
    this.ydoc.destroy();
    this.editor?.dispose();
  }

  private handleBeforeUnload = () => {
    this.provider?.awareness.setLocalState(null);
  };

  private scheduleRemoteCursorRender() {
    if (this.isRenderingDecorations) {
      this.pendingRender = true;
      return;
    }

    this.isRenderingDecorations = true;

    requestAnimationFrame(() => {
      try {
        this.renderRemoteCursors();
      } finally {
        this.isRenderingDecorations = false;

        if (this.pendingRender) {
          this.pendingRender = false;
          this.scheduleRemoteCursorRender();
        }
      }
    });
  }

  private renderRemoteCursors() {
    if (!this.editor) return;

    const model = this.editor.getModel();
    if (!model) return;

    const decorations: monaco.editor.IModelDeltaDecoration[] = [];

    this.provider.awareness.getStates().forEach((state: any) => {
      if (!state.user || !state.cursor) return;

      if (state.user.userId === this.user?.userId) return;

      const { start, end } = state.cursor;
      const color = state.user.color || '#2196f3';
      const remoteUserId = state.user.userId;

      if (state.focus) {
        this.injectCursorStyle(remoteUserId, color);
      }
      else {
        this.removeCursor(remoteUserId);
      }
      decorations.push({
        range: new monaco.Range(
          start.lineNumber,
          start.column,
          end.lineNumber,
          end.column
        ),
        options: {
          className: `remote-cursor-${remoteUserId}`,
          stickiness:
            monaco.editor.TrackedRangeStickiness
              .NeverGrowsWhenTypingAtEdges,
          hoverMessage: {
            value: `${state.user.name}`
          }
        }
      });
    });

    this.cursorDecorations = this.editor.deltaDecorations(
      this.cursorDecorations,
      decorations
    );
  }

  private injectCursorStyle(userId: string, color: string) {
    const styleId = `cursor-style-${userId}`;
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .remote-cursor-${userId} {
        background-color: ${color};
        opacity: 0.5;
        border-left: 1px solid ${color};
        border-right: 1px solid ${color};
      }
    `;

    document.head.appendChild(style);
  }

  private removeCursor(userId: string) {
    const styleId = `cursor-style-${userId}`;
    document.getElementById(styleId)?.remove();
  }

  getValue(): string {
    return this.editor?.getValue() ?? '';
  }

  setValue(value: string) {
    this.editor?.setValue(value);
  }
}
