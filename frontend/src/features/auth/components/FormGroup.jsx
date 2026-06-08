import PropTypes from 'prop-types'

const FormGroup = ({label, placeholder, value, onChange}) => {
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-white  text-2xl' htmlFor={label}> {label}</label>
      <input className='p-2 rounded-md  bg-white outline-none border-none text-black placeholder:text-gray-500' 
      value={value} onChange={onChange}
      type='text' id={label} name={label} placeholder={placeholder}  required />
    </div>
  )
}


export default FormGroup