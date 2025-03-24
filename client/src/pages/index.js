import React, {useState} from 'react'
import SpeechBubble from "@/components/SpeechBubble";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import GoalsCard from "@/components/GoalsCard";

function index() {
  const [message, setMessage] = useState('Loading message...');

  // API Fetch
  fetch('http://localhost:8080/api/home')
        .then(res => res.json())
        .then(data => setMessage(data.message));

  return (
      <>
          <div className="app min-h-screen flex flex-col bg-PS-main-purple">
              <Header />
              <section className="flex-grow flex items-center justify-center relative mt-5 mb-5">
                  <GoalsCard Progress={[0, 3, 7]} Total={[7, 7, 7]} />
                  <div className="absolute bottom-[-20px] w-full flex justify-center">
                      <Button size="large">set goals</Button>
                  </div>
              </section>
              <Footer />
          </div>
      </>
  )
}

export default index;