import React, { useEffect, useRef, useState } from 'react';
import { UserLogin } from '../../context/AuthContext';
import logo from '../../assets/img/logo.png';
import { useNavigate } from 'react-router';
import generatePDF from 'react-to-pdf';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { divideArrayIntoChunks } from '../../utils';

const CHUNK_SIZE = 31;
function InvoiceGenerated() {
  let navigate = useNavigate();
  const { formData, setFormData } = UserLogin();
  const targetRef = useRef();
  const [visibleBillToFields, setVisibleBillToFields] = useState(3);
  const [focusedField, setFocusedField] = useState(null);

  const handleGenerateNew = () => {
    setFormData({
      installer: '',
      bill_to: [''],
      PO_number: '',
      PO_date: '',
      type_of_work: '',
      job_site_num: '',
      job_site_name: '',
      job_location: '',
      items: [
        {
          lot_no: '',
          description: '',
          quantity: '',
          price_each: '',
        },
      ],
      invoice: {
        invoice_num: null,
        date: null,
        total_amount: null,
      },
    });
    navigate('/estimate');
  };

  /* Press enter key to add new field as well as key focus */
  const handleBillToEnterKey = (e, fieldIndex) => {
    if (e.key === 'Enter') {
      const nextVisibleFields = Math.min(visibleBillToFields + 1, 3);
      setVisibleBillToFields(nextVisibleFields);
      setFocusedField(nextVisibleFields - 1);
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (focusedField !== null) {
      const inputRef = document.getElementById(`bill_to_${focusedField + 1}`);
      if (inputRef) {
        inputRef.focus();
      }
    }
  }, [focusedField]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${month}-${day}-${year}`;
  }

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const baseInvoiceSectionStyle = {
    marginTop: '200px',
    border: '2px solid white',
    // height: "1200px"
  };

  const handleNavigateMain = () => {
    setFormData({
      bill_to: [''],
      PO_number: '',
      PO_date: '',
      PO_Invoice_date: '',
      type_of_work: '',
      job_site_num: '',
      job_site_name: '',
      job_location: '',
      items: [
        {
          lot_no: '',
          description: '',
          quantity: '',
          price_each: '',
        },
      ],
      invoice: {
        invoice_num: null,
        date: null,
        total_amount: null,
      },
    });
    navigate('/main');
  };

  const chunkedArray = () => {
    return divideArrayIntoChunks(formData, CHUNK_SIZE);
  };

  return (
    <div id='invoice-generated'>
      <div className='row'>
        <div className='col-3' style={{ marginTop: '40px' }}>
          <div className='add-container'>
            <span
              onClick={handleNavigateMain}
              className='new-invoice-btn'
              style={{ marginRight: '20px', background: 'grey' }}
            >
              <i class='fas fa-home fa-1x'></i>
            </span>
            <span onClick={handleGenerateNew} className='new-invoice-btn'>
              New estimate
            </span>
          </div>
        </div>
        <div className='col-6'>
          <h2>Estimate Details</h2>
        </div>
        <div className='col-3' style={{ marginTop: '50px' }}>
          <span
            onClick={() => generatePDF(targetRef, { filename: 'estimate.pdf' })}
            className='new-invoice-btn'
            style={{ background: 'green', border: 'none' }}
          >
            Generate PDF
            {/* <i class="fa fa-download fa-2x" aria-hidden="true"></i> */}
          </span>
        </div>
      </div>

      <div
        className='container h-100 px-5 py-5'
        style={{ width: '100%' }}
        ref={targetRef}
      >
        <div id='pdf'>
          <div className='row item_details_div px-3'>
            {chunkedArray().map((outerItem, index) => (
              <>
                <div
                  style={
                    index != 0
                      ? baseInvoiceSectionStyle
                      : { border: '2px solid white' }
                  }
                >
                  <div className='row'>
                    <div className='invoice-first-div col-9 '>
                      <img src={logo} alt='logo tub' />
                      <address className='mt-3 px-3'>
                        <b style={{ fontSize: '28px' }}>Tub Pro's, Inc. </b>
                        <br />
                        <span style={{ fontSize: '22px' }}>
                          PO Box 30596 <br />
                          Las Vegas, NV. 89173 <br />
                          Office: (702) 445-6262 <br />
                          Fax: &nbsp;&nbsp;&nbsp;&nbsp;(702) 445-6241
                        </span>
                      </address>
                    </div>
                    <div className='col-3'>
                      <p className='invoice-details'>
                        <b>Estimate</b>
                      </p>
                      <p>
                        Number &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {formData.invoice && formData.invoice.invoice_num
                          ? formData.invoice.invoice_num
                          : ''}
                      </p>

                      <p>
                        Date
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {formData.invoice && formData.invoice.date
                          ? new Date(formData.invoice.date).toLocaleDateString()
                          : ''}
                      </p>
                    </div>
                  </div>

                  <div
                    className='row bill_to_div '
                    style={{ width: '50%', border: '2px solid white' }}
                  >
                    <div className='col-md-9'>
                      <p>
                        <p style={{ fontWeight: '800', marginTop: '25px' }}>
                          Bill To
                        </p>
                        {[1, 2, 3].map(
                          (fieldIndex) =>
                            fieldIndex <= visibleBillToFields && (
                              <React.Fragment key={`bill_to_${fieldIndex}`}>
                                <TextField
                                  variant='standard'
                                  value={formData.bill_to[fieldIndex - 1]}
                                  onKeyDown={(e) =>
                                    handleBillToEnterKey(e, fieldIndex - 1)
                                  }
                                  style={{ height: '100%' }}
                                  readOnly
                                  InputProps={{
                                    disableUnderline: true,
                                  }}
                                />
                              </React.Fragment>
                            )
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='last-row'>
                  <div className='row po_details_div px-3'>
                    <div className='col-md-1 text-center'>
                      <b>PO No.</b>
                      <div className='mt-2'>{formData.PO_number}</div>
                    </div>
                    <div className='col-md-2 text-center'>
                      <b>PO Date</b>
                      <div className='mt-2'>{formatDate(formData.PO_date)}</div>
                    </div>
                    <div className='col-md-2 text-center'>
                      <b>Type of Work</b>
                      <div className='mt-2'>{formData.type_of_work}</div>
                    </div>
                    <div className='col-md-2 text-center'>
                      <b>Job Site No.</b>
                      <div className='mt-2'>{formData.job_site_num}</div>
                    </div>
                    <div className='col-md-2 text-center'>
                      <b>Job Name</b>
                      <div className='mt-2'>{formData.job_site_name}</div>
                    </div>
                    <div className='col-md-3 text-center'>
                      <b>Job Location</b>
                      <div className='mt-2'>{formData.job_location}</div>
                    </div>
                  </div>
                  <div className='line'></div>
                  <div className='row item_details_div'>
                    <span className='plus-icon'>
                      {/* <i className="fas fa-plus-circle"></i> */}
                    </span>
                    &nbsp;
                    <div className='col-md-2'>
                      <b>Lot No.</b>
                    </div>
                    <div className='col-md-6 text-center'>
                      <b>Description</b>
                    </div>
                    <div className='col-md-1' style={{ marginLeft: '-2px' }}>
                      <b>Quantity</b>
                    </div>
                    <div className='col-md-2' style={{ marginLeft: '20px' }}>
                      <b>Price Each</b>
                    </div>
                    <div className='col-md-1' style={{ marginLeft: '-75px' }}>
                      {' '}
                      <b>Amount</b>
                    </div>
                  </div>
                  {outerItem.items.map((item, innerIndex) => (
                    <div
                      className='row'
                      style={{ marginTop: innerIndex === 0 ? '6%' : '0px' }}
                    >
                      <div className='col-md-2'>
                        <TextField
                          id={`lot_no_${innerIndex}`}
                          key={innerIndex}
                          // ref={el => inputRefs.current[innerIndex] = el}
                          variant='standard'
                          type='text'
                          name='lot_no'
                          value={item.lot_no}
                          aria-readonly
                          style={{
                            width: `${Math.max(
                              30,
                              Math.min(
                                10 +
                                  (item.lot_no ? item?.lot_no?.length : 0) * 8,
                                100
                              )
                            )}%`,
                          }}
                          InputProps={{
                            disableUnderline: true,
                          }}
                        />
                      </div>
                      <div className='col-md-6'>
                        <TextField
                          id={`description_${innerIndex}`}
                          variant='standard'
                          type='text'
                          name='description'
                          value={item.description}
                          aria-readonly
                          style={{
                            marginTop: innerIndex === 0 ? '-10px' : '-10px',
                          }}
                          // inputProps={{ style: { width: '100%', maxWidth: '100%', height: "100%" } }}
                          // style={{ width: `${Math.min(8 + (item?.description?.length * 2), 100)}%` }}
                          InputProps={{
                            disableUnderline: true,
                          }}
                        />
                      </div>
                      <div className='col-md-1 text-center'>
                        <TextField
                          id={`quantity_${innerIndex}`}
                          variant='standard'
                          type='text'
                          name='quantity'
                          value={item.quantity}
                          aria-readonly
                          InputProps={{
                            disableUnderline: true,
                            style: { textAlign: 'center' },
                          }}
                          style={{ width: '100%', marginLeft: '45px' }}
                        />
                      </div>
                      <div
                        className='col-md-2 text-center'
                        style={{ position: 'relative' }}
                      >
                        <TextField
                          id={`price_each_${innerIndex}`}
                          variant='standard'
                          type='text'
                          name='price_each'
                          aria-readonly
                          value={item.price_each}
                          style={{ width: '60%', marginLeft: '33px' }}
                          InputProps={{
                            startAdornment:
                              item.price_each && item.price_each !== '' ? (
                                <InputAdornment position='start'>
                                  <span
                                    style={{
                                      fontSize: '20px',
                                      color: 'black',
                                    }}
                                  >
                                    $
                                  </span>
                                </InputAdornment>
                              ) : null,
                            disableUnderline: true,
                          }}
                        />
                      </div>
                      <div
                        className='col-md-1'
                        style={{
                          marginLeft: '-50px',
                          width: '150px',
                          textAlign: 'center',
                        }}
                      >
                        <p style={{ margin: '0' }}>
                          {item.quantity && item.price_each
                            ? `$${(
                                (item.quantity || 0) *
                                (parseFloat(item.price_each) || 0)
                              ).toFixed(2)}`
                            : ''}
                        </p>
                      </div>
                    </div>
                  ))}{' '}
                  <div
                    className='invoice-last-div px-3'
                    style={{
                      marginTop:
                        formData.items.length === 2
                          ? '1000px'
                          : formData.items.length >= 3 &&
                            formData.items.length <= 5
                          ? '600px'
                          : formData.items.length >= 6 &&
                            formData.items.length <= 8
                          ? '500px'
                          : formData.items.length >= 9 &&
                            formData.items.length <= 11
                          ? '220px'
                          : formData.items.length >= 12 &&
                            formData.items.length <= 14
                          ? '6px'
                          : formData.items.length >= 15 &&
                            formData.items.length <= 16
                          ? '0px'
                          : formData.items.length >= 17 &&
                            formData.items.length <= 18
                          ? '2px'
                          : formData.items.length >= 19 &&
                            formData.items.length <= 20
                          ? '2px'
                          : formData.items.length >= 21 &&
                            formData.items.length <= 30
                          ? '2px'
                          : formData.items.length > 31
                          ? '0px'
                          : '0px',
                    }}
                  >
                    <p
                      style={{
                        marginRight: '70px',
                        // marginTop: formData.items.length > 17 ? "30%" : "0px"
                        marginTop: '70px',
                      }}
                    >
                      Total Due:{' '}
                      {`$${formData?.total_amount?.toFixed(2) || ''}`}
                    </p>
                    <h5
                      style={{
                        fontSize: '25px',
                        fontWeight: '600',
                        marginTop: '-50px',
                      }}
                    >
                      Thank You! We truly appreciate your business!
                    </h5>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceGenerated;
