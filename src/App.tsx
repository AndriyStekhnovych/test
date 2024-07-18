import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import './App.css';

interface IForm {
  name: string;
  email: string;
  message: string;
}

function App() {
  const { register, handleSubmit, formState } = useForm<IForm>({
    mode: 'onChange',
  });

  const nameError = formState.errors.name?.message;
  const emailError = formState.errors.email?.message;
  const messageError = formState.errors.message?.message;

  const realFileBtnRef = useRef<HTMLInputElement | null>(null);
  const customTxtRef = useRef<HTMLSpanElement | null>(null);
  const customBtnRef = useRef<HTMLButtonElement | null>(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const realFileBtn = realFileBtnRef.current;
    const customBtn = customBtnRef.current;

    const handleClick = () => {
      realFileBtn?.click();
    };

    const handleChange = () => {
      if (realFileBtn?.files?.length) {
        setFileName(realFileBtn.files[0].name);
        setFile(realFileBtn.files[0]);
      } else {
        setFileName('No file chosen');
        setFile(null);
      }
    };

    customBtn?.addEventListener('click', handleClick);
    realFileBtn?.addEventListener('change', handleChange);

    return () => {
      customBtn?.removeEventListener('click', handleClick);
      realFileBtn?.removeEventListener('change', handleChange);
    };
  }, []);

  const onSubmit: SubmitHandler<IForm> = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('message', data.message);
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch('http://localhost:3005/myapp/send', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Email sent successfully');
    } else {
      const errorMessage = await response.text();
      alert('Error sending email: ' + errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="What’s your name?"
        {...register('name', {
          required: 'This field is required',
        })}
      />
      {nameError && <p style={{ color: 'tomato', margin: '0', fontSize: 14 }}>{nameError}</p>}

      <input
        type="text"
        placeholder="Your email"
        {...register('email', {
          required: 'This field is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,
            message: 'Invalid email address',
          },
        })}
      />
      {emailError && <p style={{ color: 'tomato', margin: '0', fontSize: 14 }}>{emailError}</p>}

      <input
        type="text"
        placeholder="Tell me about your project"
        {...register('message', {
          required: 'This field is required',
        })}
      />
      {messageError && <p style={{ color: 'tomato', margin: '0', fontSize: 14 }}>{messageError}</p>}
      <div className="form-b">
        <div className="button_box">
          <button className="mainbutton" type="submit">
            Get a Quote
          </button>
        </div>

        <div className="file_input_box">
          <input type="file" style={{ display: 'none' }} id="fileupload" ref={realFileBtnRef} />
          <span className="fileuploadtext" id="fileuploadtext" ref={customTxtRef}>
            {fileName}
          </span>

          <button type="button" id="fileuploadbutton" ref={customBtnRef}>
            <img src="/public/upload.svg" alt="" />
          </button>
        </div>
      </div>
    </form>
  );
}

export default App;