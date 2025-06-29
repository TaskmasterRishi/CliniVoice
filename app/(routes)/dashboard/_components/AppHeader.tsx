'use client'
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import { Navbar, NavBody, NavItems, MobileNav, MobileNavHeader, MobileNavMenu, MobileNavToggle } from '@/components/ui/resizable-navbar'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const menuOptions = [
    {
        name: 'Home',
        link: '/dashboard'
    },
    {
        name: 'History',
        link: '/dashboard/history'
    },{
        name: 'Pricing',
        link: '/dashboard/billing'
    },{
        name: 'Profile',
        link: '/dashboard/profile'
    },
]

const AppHeader = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false)
  const router = useRouter()

  return (
    <Navbar>
      <NavBody>
        <motion.div 
          className='flex items-center gap-2'
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Image src={"/logo.png"} alt='clinivoice logo' width={50} height={50} />
          <h1 className='text-xl font-bold'>CliniVoice</h1>
        </motion.div>
        <NavItems items={menuOptions} />
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ zIndex: 1 }}
        >
          <UserButton/>
        </motion.div>
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <motion.div 
            className='flex items-center gap-2'
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Image src={"/logo.png"} alt='clinivoice logo' width={50} height={50} />
            <h1 className='text-xl font-bold'>CliniVoice</h1>
          </motion.div>
          <div className='flex items-center gap-2'>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MobileNavToggle 
                isOpen={isMobileNavOpen} 
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} 
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <UserButton/>
            </motion.div>
          </div>
        </MobileNavHeader>
        <MobileNavMenu isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)}>
          {menuOptions.map((item, idx) => (
            <motion.div 
              key={idx} 
              className="px-4 py-2 text-neutral-600 dark:text-neutral-300 cursor-pointer"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(0,0,0,0.05)',
                paddingLeft: '1.5rem'
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => router.push(item.link)}
            >
              {item.name}
            </motion.div>
          ))}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}

export default AppHeader