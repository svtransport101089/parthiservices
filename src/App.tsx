import { motion, useScroll, useTransform } from 'motion/react';
import {
  Code,
  Cookie,
  SprayCan,
  Sparkles,
  Home,
  Leaf,
  Car,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  CalendarDays,
  CreditCard,
  FlaskConical,
  Heart,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from './supabase';

const services = [
  {
    title: 'Software Programming',
    description: 'Custom software solutions, web development, and tech support.',
    icon: Code,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Snacks Distribution',
    description: 'UNIBIC, A2B (5,10,20,35), OTTER, DONUT ZIGGY, NATURO JELLY',
    icon: Cookie,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    title: 'Housekeeping Materials',
    description: 'High-quality cleaning supplies and housekeeping materials distributor.',
    icon: SprayCan,
    color: 'bg-teal-100 text-teal-600',
  },
  {
    title: 'Deep Cleaning Services',
    description: 'Thorough deep cleaning for homes and offices to ensure a spotless environment.',
    icon: Sparkles,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Housekeeping Services',
    description: 'Regular housekeeping and maintenance to keep your space organized.',
    icon: Home,
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    title: 'Gardening Work',
    description: 'Professional gardening, landscaping, and plant care services.',
    icon: Leaf,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Car Cleaning',
    description: 'Detailed interior and exterior car cleaning and washing.',
    icon: Car,
    color: 'bg-slate-100 text-slate-600',
  },
];

const areas = [
  'Mambalam to Guduvanchery',
  'Padappai to Medavakkam',
  'Anakaputhur to Tambaram',
];

export default function App() {
  const [isBooking, setIsBooking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    notes: ''
  });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  const getDayName = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const selectedDay = getDayName(selectedDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // 1. Submit to Supabase (Primary Database)
      if (!supabase) {
        throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your secrets.');
      }

      const { error: supabaseError } = await supabase
        .from('bookings')
        .insert([
          {
            ...formData,
            date: selectedDate,
            time: `${selectedDay.toLowerCase()}_evening`,
          }
        ]);

      if (supabaseError) {
        console.error('Supabase Insert Error:', supabaseError);
        throw new Error(`Supabase Error: ${supabaseError.message}`);
      }

      // 2. Send Email Notification directly to parthi1010891@gmail.com
      const emailResponse = await fetch("https://formsubmit.co/ajax/parthi1010891@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `New Booking Request: ${formData.service}`,
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone,
          Service: formData.service,
          Date: selectedDate,
          Time: `${selectedDay.toLowerCase()}_evening`,
          Location: formData.location,
          Notes: formData.notes || "None provided"
        })
      });

      if (!emailResponse.ok) {
        console.error('Email Notification Error: Failed to send email.');
      }

      setIsBooking(true);
      // Reset form
      setFormData({ name: '', email: '', phone: '', service: '', location: '', notes: '' });
      setSelectedDate('');
    } catch (err) {
      console.error('Submission Error:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-emerald-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="font-semibold text-xl tracking-tight">Parthi Services</span>
            </div>
            <button 
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-medium transition-colors text-sm"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 bg-[url('https://picsum.photos/seed/clean/1920/1080?blur=4')] bg-cover bg-center opacity-10 h-[150%]" 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold tracking-tight text-stone-900 mb-6"
            >
              Professional Services for Your <span className="text-emerald-600">Home & Business</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-stone-600 mb-8"
            >
              From software programming to deep cleaning, gardening, and delicious snacks. 
              A multi-talented professional ready to serve you with excellence.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white border border-stone-200 hover:border-emerald-600 hover:text-emerald-600 text-stone-900 px-8 py-3 rounded-full font-medium transition-all"
              >
                Explore Services
              </button>
              <button 
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-emerald-600/20"
              >
                Book Now
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              Comprehensive services tailored to your needs. Whether you need a website built, 
              your house deep cleaned, or fresh snacks delivered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-stone-100 bg-stone-50 hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${service.color}`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-stone-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Availability & Areas */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Availability & Coverage</h2>
              <p className="text-stone-400 mb-8 text-lg">
                Flexible scheduling to meet your needs. Serving major routes across the city.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Service Area</h4>
                    <p className="text-stone-400 font-medium text-emerald-400">Strictly within 25 km radius from Tambaram</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Working Hours</h4>
                    <p className="text-stone-400">Daily Evening Appointments</p>
                    <p className="text-stone-400">Sundays Available</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Service Routes</h4>
                    <ul className="space-y-2">
                      {areas.map((area) => (
                        <li key={area} className="flex items-center gap-2 text-stone-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-3xl blur-3xl opacity-20" />
              <div className="bg-stone-800 border border-stone-700 p-8 rounded-3xl relative">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  Payment Information
                </h3>
                <div className="bg-stone-900 p-6 rounded-2xl border border-stone-700 text-center">
                  <p className="text-sm text-stone-400 mb-2">Google Pay / UPI ID</p>
                  <p className="text-xl md:text-2xl font-mono text-emerald-400 break-all">
                    parthi101089-2@oksbi
                  </p>
                </div>
                <p className="text-stone-400 text-sm mt-6 text-center">
                  Secure payments accepted via GPay for all services and distributions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Book an Appointment</h2>
              <p className="text-stone-500">Fill out the form below to schedule a service.</p>
            </div>

            {isBooking ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Request Sent!</h3>
                <p className="text-stone-600 mb-8">
                  Thank you for booking. I will contact you shortly to confirm the appointment.
                </p>
                <button 
                  onClick={() => setIsBooking(false)}
                  className="text-emerald-600 font-medium hover:underline"
                >
                  Book another service
                </button>
              </motion.div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {submitError && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
                    {submitError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Name</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                    <input 
                      required
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Your email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Service Required</label>
                    <select 
                      required
                      name="service"
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                    >
                      <option value="">Select a service...</option>
                      {services.map(s => (
                        <option key={s.title} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Preferred Date</label>
                    <input 
                      required
                      type="date" 
                      name="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Preferred Time</label>
                    <select 
                      required
                      name="time"
                      disabled={!selectedDate}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white disabled:bg-stone-100 disabled:text-stone-400"
                    >
                      <option value="">{selectedDate ? 'Select time...' : 'Please select a date first'}</option>
                      {selectedDay && (
                        <option value={`${selectedDay.toLowerCase()}_evening`}>
                          {selectedDay.toUpperCase()} EVENING
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Location / Area</label>
                  <select 
                    required
                    name="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                  >
                    <option value="">Select your area...</option>
                    {areas.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                    <option value="other">Other (Please specify in notes)</option>
                  </select>
                  <p className="mt-2 text-sm text-emerald-600 font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Note: Bookings are only accepted within a 25 km radius from Tambaram.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Additional Notes</label>
                  <textarea 
                    rows={4}
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                    placeholder="Any specific requirements or details..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-4 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CalendarDays className="w-5 h-5" />
                  )}
                  {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Donate for R&D Section */}
      <section className="py-24 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/1920/1080?blur=4')] bg-cover bg-center opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="w-16 h-16 bg-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-700">
            <FlaskConical className="w-8 h-8 text-emerald-300" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Donate for R & D</h2>
          <p className="text-emerald-100/80 text-lg mb-12 max-w-2xl mx-auto">
            Your contributions fuel our Research and Development. Help us build better software, improve our services, and innovate for the future.
          </p>
          
          <div className="bg-white text-stone-900 p-8 rounded-3xl max-w-sm mx-auto shadow-2xl">
            <div className="mb-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-2">
                P
              </div>
              <h3 className="font-semibold text-lg">Parthiban D</h3>
              <p className="text-stone-500 text-sm">Scan to pay with any UPI app</p>
            </div>
            
            <div className="bg-stone-50 p-4 rounded-2xl mb-6 inline-block border border-stone-100">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=parthi101089-2@oksbi&pn=Parthiban%20D&cu=INR" 
                alt="Donation QR Code" 
                className="w-48 h-48"
              />
            </div>
            
            <div className="bg-stone-100 p-4 rounded-xl flex items-center justify-between gap-4 text-left">
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">UPI ID</p>
                <p className="font-mono text-emerald-700 font-medium break-all">parthi101089-2@oksbi</p>
              </div>
              <Heart className="w-6 h-6 text-emerald-500 shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 py-12 text-center text-stone-400">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-12 h-12 bg-emerald-600/20 text-emerald-500 rounded-xl flex items-center justify-center font-bold mx-auto mb-6 text-xl">
            P
          </div>
          <p className="mb-4">Professional Services by Parthi</p>
          <p className="text-sm text-stone-500">
            © {new Date().getFullYear()} Parthi Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
