import { getUserAvailability } from '@/actions/availability'
import React from 'react'
import { defaultAvailability } from './data'
import AvailabilityForm from './_components/availabilityForm'

const AvailabilityPage = async() => {
    const availability = await getUserAvailability() // Since we didn't put 'use client', it will be a server component. So, we can import the actions directly like this
    console.log(availability)
    return <AvailabilityForm initialData={availability || defaultAvailability} />
}

export default AvailabilityPage