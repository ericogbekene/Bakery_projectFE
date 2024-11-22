import React from 'react'
import Image from 'next/image'
import productImage from '@/assets/images/Russian Tip.jpeg'

export default function Features() {
    return (
        <div className='m-5 gap-6'>
            <div className='flex flex-col items-center justify-center gap-5'>
                <h1 className='text-lg'>Discover New Products</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. <br/> Cum illo tempora reprehenderit
                    Unde, sapiente consequatur?</p>
            </div>

            <div>
                <div className='flex items-center justify-center gap-5 m-5  '>
                    <Image
                        src={productImage}
                        width={200}
                        height={200}
                        alt='Russian Tip Cake'
                    />
                    <Image
                        src={productImage}
                        width={200}
                        height={200}
                        alt='Russian Tip Cake'
                    />
                    <Image
                        src={productImage}
                        width={200}
                        height={200}
                        alt='Russian Tip Cake'
                    />
                </div>
            </div>
        </div>
    )
}
