import { Editor } from '@tinymce/tinymce-react';


const MyEditor = ({ value, onChange }) => {
  return (
    <>
      <Editor
        apiKey="2m3zgsx1fjh39mvr4k53svbffg1ovuc7mfdb31pr02t5hdcv" 
        // Có thể đăng ký free key tại https://www.tiny.cloud/
        value={value}
        onEditorChange={(newValue) => onChange(newValue)}
        init={{
          height: 300,
          menubar: true,
          plugins: 'image lists code',
          toolbar:
            'undo redo | formatselect fontsizeselect | ' +
            'bold italic underline | alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | image | code',
            fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt',
           // 👈 bạn có thể tùy chọn
          file_picker_types: 'image',
          file_picker_callback: (cb, value, meta) => {
            if (meta.filetype === 'image') {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');

              input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                  const id = 'blobid' + new Date().getTime();
                  const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                  const base64 = reader.result.split(',')[1];
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);
                  cb(blobInfo.blobUri(), { title: file.name });
                });
                reader.readAsDataURL(file);
              });

              input.click();
            }
          },
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
        }}
      />
    </>
  )
}


export default MyEditor;