import React from 'react';
import { Phone, MailIcon, MessageCircle, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <div className="w-full max-w-6xl">
        <div className='relative bg-[#F4DDE7] text-center p-6'>
          <h1>Contact Us</h1>
          <p className='font-bold text-2xl'>We&apos;d love to talk to you</p>
          <div className='flex items-center justify-center mt-4'>
            <div className='absolute top-[100px] flex gap-4 items-center bg-white shadow-lg p-4 rounded-md'>
              <p className='font-bold'>Our availability</p>
              <div>
                <p>8am - 7pm</p>
                <p className='font-bold'>Monday - Saturday</p>
              </div>
            </div>
          </div>
        </div>
        
        <section className='my-20 px-4'>
          <div className='text-center mb-10'>
            <h1>Let&apos;s get started</h1>
            <p className='font-bold'>We&apos;re here to listen, create, and collaborate</p>
          </div>
          
          <div className='flex flex-col lg:flex-row gap-8 w-full'>
            {/* Form Section */}
            <div className='flex flex-col gap-4 w-full lg:w-1/2'>
              <input placeholder='First Name' className='p-3 bg-[#E2E7D7] w-full rounded' />
              <input placeholder='Last Name' className='p-3 bg-[#E2E7D7] w-full rounded' />
              <input placeholder='Email Address' className='p-3 bg-[#E2E7D7] w-full rounded' />
              <input placeholder='Phone Number' className='p-3 bg-[#E2E7D7] w-full rounded' />
              <input placeholder='Subject' className='p-3 bg-[#E2E7D7] w-full rounded' />
              <textarea placeholder='Message enquiries' className='p-3 bg-[#E2E7D7] w-full h-24 rounded'></textarea>
              <button type='submit' className='bg-[#C85387] text-white w-full py-3 rounded'>Submit</button>
            </div>
            
            {/* Contact Details Section */}
            <div className='flex flex-col gap-4 w-full lg:w-1/2'>
              {[
                { icon: <Phone color="#C85387" />, title: 'Phone number', info: '+2348100009968' },
                { icon: <MessageCircle color="#C85387" />, title: 'WhatsApp', info: '+2348100009968' },
                { icon: <MailIcon color="#C85387" />, title: 'Email Address', info: 'mandccakes@gmail.com' },
                { icon: <MapPin color="#C85387" />, title: 'Location', info: '49, Rufus Aigbodun Crescent, Jahi, Abuja' }
              ].map((item, index) => (
                <div key={index} className='flex items-center gap-4 border border-gray-300 p-4 rounded shadow-md w-full'>
                  {item.icon}
                  <div>
                    <p className='font-bold'>{item.title}</p>
                    <p>{item.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='text-center px-4'>
          <h1 className='font-bold text-2xl'>How helpful were we today?</h1>
          <p>
            Your feedback is the secret ingredient to our success. Share your thoughts with us! 
            <a href="mailto:mandccakes@gmail.com" className='text-[#C85387]'> Send us a message</a>
          </p>
        </section>
      </div>
    </div>
  );
}
