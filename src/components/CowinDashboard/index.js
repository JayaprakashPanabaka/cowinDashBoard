// Write your code here
import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationByAge from '../VaccinationByAge/index'
import VaccinationByGender from '../VaccinationByGender/index'
import VaccinationByCoverage from '../VaccinationCoverage/index'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const CowinDashboard = () => {
  const [vaccinationData, setVaccinationData] = useState({})
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  //   console.log(apiStatus)

  const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

  const getVaccinationData = async () => {
    setApiStatus(apiStatusConstants.inProgress)

    const response = await fetch(vaccinationDataApiUrl)

    if (response.ok === true) {
      const jsonData = await response.json()
      //   console.log(jsonData.last_7_days_vaccination)
      const updatedData = {
        last7DaysVaccination: jsonData.last_7_days_vaccination.map(
          eachDayData => ({
            vaccinationDate: eachDayData.vaccination_date,
            dose1: eachDayData.dose_1,
            dose2: eachDayData.dose_2,
          }),
        ),

        vaccinationByAge: jsonData.vaccination_by_age.map(range => ({
          age: range.age,
          count: range.count,
        })),

        vaccinationByGender: jsonData.vaccination_by_gender.map(genderType => ({
          gender: genderType.gender,
          count: genderType.count,
        })),
      }
      setVaccinationData(updatedData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getVaccinationData()
  }, [])

  //   console.log(vaccinationData)

  const renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  const renderLoadingView = () => (
    <div className="loading-view" data-testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  const renderVaccinationStats = () => (
    <>
      <VaccinationByCoverage
        vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
      />
      <VaccinationByGender
        vaccinationGenderDetails={vaccinationData.vaccinationByGender}
      />
      <VaccinationByAge
        vaccinationAgeDetails={vaccinationData.vaccinationByAge}
      />
    </>
  )

  const renderViewsBasedOnApiStatus = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderVaccinationStats()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return (
    <>
      <div className="app-container">
        <div className="cowin-dashboard-container">
          <div className="logo-container">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1 className="logo-heading">Co-WIN</h1>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {renderViewsBasedOnApiStatus()}
        </div>
      </div>
    </>
  )
}

export default CowinDashboard
