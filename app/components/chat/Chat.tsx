"use client"
import useState  from 'react-usestateref';
import { MessageProps,Creator } from '../../interfaces';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';

const url = '/api/genie'

 export const Chat = () => { 
  const [messages, setMessages, messageRef] = useState<MessageProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter, counterRef] = useState(0); 
  
//deactivated to save the prompt cost
  // useEffect(() => {
  //   callApi(`you are a homeophatic doctor who has all the information
  //   availiable about homephatic and remedies.
  //   act like im youre patient, like a real homeophatic doctor will act,
  //   in youre first prompt introduce yourself,
  //   youre goal is to find to best remedy,
  //   you have a maximum of 8 questions
  //   use as many follow up question as needed but ask only one single question at each prompt.
  //   start by introducing yourself.`)
  // }, [])
  

  const callApi = async (input: string) => {
    setLoading(true);
    setCounter(counterRef.current + 1);
    const myMessage: MessageProps = {
      "role": Creator[Creator.user],
      "content": input,
      "key": counterRef.current
    };
    setMessages([...messageRef.current, myMessage]);

  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messageRef.current.map(({ key, ...rest }) => rest)
      })      
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setCounter(counterRef.current + 1);
      const botMessage: MessageProps = {
        "role": Creator[Creator.assistant],
        "content": data.text,
        "key": counterRef.current
      };
      setMessages([...messageRef.current, botMessage]);
      setLoading(false);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      setLoading(false);
      alert('Something went wrong');
    }
  };
  
  

  return (
    <main className="relative max-w-2xl mx-auto">
      <div className='sticky top-0 w-fll pt-10 px-4'>
      <ChatInput onSend={(input: string) => callApi(input)} disabled={loading}/>
      </div>
      
      <div className='mt-10 px-4'>
      {messageRef.current.map((msg: MessageProps) => ( msg.key > 1 &&
  <ChatMessage key={msg.key} content={msg.content} role={msg.role}/>
))}
        {messages.length === 0 && <p className='text-center text-gray-400'>I am at youre service</p>}
      </div>
    </main>
  );
  };


