import {createSignal, onMount} from "solid-js";
declare var tinymce: any;
interface tinyMCEPropsType {
  selector: string;
  name?: string;
  onEditorChange: any;
  readonly?:boolean
}
function EditorTinyMCE({selector,onEditorChange,name,readonly}:tinyMCEPropsType) {
  const loadTinyMCE = () => {
    const tinyMCEPath = "https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.0.3/tinymce.min.js";
    const script = document.createElement("script");
    script.id = "tiny-mce-script";
    script.src = tinyMCEPath;
    document.head.appendChild(script);
    script.onload = () => {
      const editorOptions: any =  initTinyMCEConfig("textarea#"+ selector, tinymce);
      if (editorOptions) {
        editorOptions['setup'] = (editor:any) => {
          editor.on('blur', () => { 
            let obj ={
              name:name,
              value:editor.getContent()
            }
            onEditorChange(obj)  
          });

          // This function uses  to change the image description instead of the Image Alt
          editor.on('OpenWindow', function(e:any) {
            if(document.getElementsByClassName('tox-label')[1].textContent === 'Alternative description'){
              document.getElementsByClassName('tox-label')[1].textContent = "Image alt"
            }
          });
        }
        editorOptions['readonly'] = readonly;
        editorOptions['protect'] = [/<!--tinyMCEIgnoreStart-->.*<!--tinyMCEIgnoreEnd-->/gims ];
      }
      tinymce.init(editorOptions);
    }
    
  };

  onMount(() => {
    const tinyMCEScript:any = document.getElementById('tiny-mce-script');
    if (tinyMCEScript) {
      tinyMCEScript?.parentNode?.removeChild(tinyMCEScript);
    }
    loadTinyMCE();
  });

  
  const initTinyMCEConfig = (selector:any, tinymce:any) => {
    return{
      selector,
      promotion: false,
      menu: {},
      entity_encoding: "raw",
      indent: false,
      menubar: "",
      relative_urls: false,
      plugins: 'table link image media lists wordcount  code  directionality ',
      toolbar: ` code | undo redo  | bold italic underline | link image media forecolor backcolor | placeholders  | fontselect |  fontsizeselect | 
      styleselect | superscript subscript strikethrough |
          alignleft aligncenter alignright alignjustify | 
          bullist numlist outdent indent|  
          print preview  fullpage |  emoticons | table | ltr | rtl`,
      font_formats:
        "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; DIN-2014=din-2014,sans-serif;Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",

      branding: false,
      browser_spellcheck: true,
      fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt",
      extended_valid_elements:
        "span[class,style,id,title],i[class],script[language|type|async|src|charset],img[lazyLoad,src,class,alt,title,id]",
      valid_children:
        "+a[div|i|span|img|p|ul|ol|li|h1|h2|h3|h4|h5|h5|h6|figure|figcaption],+li[a],+span[i|span|div|img]",
      verify_html: false, // ! this allows to add empty tags
      file_picker_types: "image",
      image_title: true,
      image_dimensions: true, // ! allows resizing of image in image details
      sms_image_dimensions: true,
      automatic_uploads: false,
      object_resizing: true,

      rel_list: [
        {title: "No Referrer", value: "noreferrer"},
        {title: "External Link", value: "external"},
        {title: "No Follow", value: "nofollow"},
        {title: "Alternate", value: "alternate"},
      ],
      // images_upload_handler: (blobInfo, success, failure) => {
      //   const newFile = new File([blobInfo.blob()], blobInfo.filename());
      //   this._imageHttp
      //     .uploadImage([newFile])
      //     .toPromise()
      //     .then(
      //       (res) => {
      //         if (res && res.length) {
      //           success(res[0].url);
      //         } else {
      //           failure('Invalid Response');
      //         }
      //       },
      //       (err) => {
      //         console.log('TinyMceComponent -> //input.onchange -> err', err);
      //         failure(err.message);
      //       }
      //     );
      // }
    };
  };

  return (
    <div>
      <textarea id={selector}> </textarea>
    </div>
  );
}

export {EditorTinyMCE};
