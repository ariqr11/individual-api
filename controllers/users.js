// untuk menyimpan controller yang menyimpan data user
const { dbConf, dbQuery } = require('../config/db'); // bertipe async
const { hashPassword } = require('../config/encript')
const { createToken } = require('../config/encript')
const { transport } = require('../config/nodemailer')

module.exports = {
  getData: (req, res) => {
    if (!req.query.email) {
      dbConf.query(`select u.* from users u  ;`,
        (err, results) => {
          if (err) {
            console.log('Error query :', err);
            res.status(500).send(err);
          } else {
            console.log('Results SQL', results);
            res.status(200).send(results);
          }
        })
    } else {
      dbConf.query(`select u.* from users u where u.email="${req.query.email}"  ;`,
        (err, results) => {
          if (err) {
            console.log('Error query :', err);
            res.status(500).send(err);
          } else {
            console.log('Results SQL', results);
            res.status(200).send(results);
          }
        })
    }
  },
  register: async (req, res) => {
    try {
      let sqlInsert = await dbQuery(`insert into users(username,email,password) values ("${req.body.username}","${req.body.email}","${hashPassword(req.body.password)}");`) // bisa pake .escape untuk mendeteksi tipe data yang dibutuhkan MySQL
      console.log(sqlInsert)
      if (sqlInsert.insertId) {
        let sqlGet = await dbQuery(`select idusers,username,email,status from users where idusers=${sqlInsert.insertId};`)
        // membuat token
        let token = createToken({ ...sqlGet[0] }, '1h');
        // mengirimkan email
        await transport.sendMail({
          from: 'MYFRIEND OFFICIAL',
          to: sqlGet[0].email,
          subject: 'Verification Email Account',
          html: `<head>

                    <meta charset="utf-8">
                    <meta http-equiv="x-ua-compatible" content="ie=edge">
                    <title>Email Confirmation</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style type="text/css">
                    /**
                     * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
                     */
                    @media screen {
                      @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                      }
                      @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                      }
                    }
                    body {
                      width: 100% !important;
                      height: 100% !important;
                      padding: 0 !important;
                      margin: 0 !important;
                    }
                    table {
                      border-collapse: collapse !important;
                    }
                    a {
                      color: #1a82e2;
                    }
                    img {
                      height: auto;
                      line-height: 100%;
                      text-decoration: none;
                      border: 0;
                      outline: none;
                    }
                    </style>
                  
                  </head>
                  <body style="background-color: #e9ecef;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" bgcolor="#e9ecef">
                          <!--[if (gte mso 9)|(IE)]>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                              <td align="center" valign="top" style="padding: 36px 24px;">
                              </td>
                            </tr>
                          </table>
                          <!--[if (gte mso 9)|(IE)]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" bgcolor="#e9ecef">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                              <img src="https://i.imgur.com/6TNJNkC.png"  border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;"><br/>  
                              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                              </td>
                            </tr>
                          </table>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" bgcolor="#e9ecef">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                <p style="margin: 0;">Hi ${sqlGet[0].username},</p>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                <p style="margin: 0;">Thank you for signing up to MyFriend, to set your account, please confirm your email address by clicking on the button below</p>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" bgcolor="#ffffff">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                      <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                            <a href="${process.env.FE_URL}/verification?verif=${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Find Your Friend</a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                <p style="margin: 0;"><a href="${process.env.FE_URL}/verification?verif=${token}" target="_blank">${process.env.FE_URL}/verification?verif=${token}</a></p>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                                <p style="margin: 0;">Best Regards,<br> MyFriend Official</p>
                              </td>
                            </tr>
                  
                          </table>
                          
                          </td>
                          </tr>
                          </table>
                          
                        </td>
                      </tr>
                                      
                    </table>
                    
                  
                  </body>`
          // `<div style="padding-left: 20%;padding-right: 20%;">
          // <div style="background-color:#DCDCDC;text-align: center ;font-size: large;">
          // <div style="text-align: center ;font-size: xx-large;margin-bottom:30px;" >Please Confirm your Email Address! </div>
          // <div style="text-align: center ;font-style:italic;margin-bottom:30px;">Thank you for signing up to MyFriend, to set your account, please confirm your email address by clicking on the button below </div>
          // <button style="text-align: center ;margin-bottom:30px;">
          // <a href='${process.env.FE_URL}/verification?verif=${token}'>Verified Account</a>
          // </button>
          // <div style="margin-bottom:30px;">If you have trouble confirming with the button above, you can click or copy and paste the link below in your browser.</div>
          // <a href='${process.env.FE_URL}/verification?verif=${token}' style="font-size: medium;">${process.env.FE_URL}/verification?verif=${token}</a>
          // <div style="margin-top:30px;">This email only valid for 1 hour</div>
          // </div>
          // </div>`
        })
        res.status(200).send({
          ...sqlGet[0],
          token
        });
      }
    } catch (error) {
      console.log('Error query :', error);
      res.status(500).send(error);
    }
  },
  verif: async (req, res) => {
    try {
      await dbQuery(`update users set status="Verified" where idusers=${req.dataToken.idusers}`)
      let resultsUser = await dbQuery(`select * from users u where u.idusers=${req.dataToken.idusers};`)
      if (resultsUser.length > 0) {
        let resultsPost = await dbQuery(`select p.*,u.username,u.profilepicture from posting p join users u on p.user_id=u.idusers  where u.idusers=${resultsUser[0].idusers} order by p.date desc; `)
        let resultsLike = await dbQuery(`Select p.*,u.username,u.profilepicture,l.idlikes from posting p join likes l on p.idposting=l.post_id join users u on u.idusers = l.user_id where u.idusers="${resultsUser[0].idusers}"`)
        res.status(200).send({
          ...resultsUser[0],
          posts: resultsPost,
          likes: resultsLike,
          token: req.token
        })
      }
    } catch (error) {
      console.log('Error query :', error);
      res.status(500).send(error);
    }
  },
  resend: async (req, res) => {
    try {
      let sqlInsert = await dbQuery(`select * from users u where u.idusers=${req.dataToken.idusers};`) // bisa pake .escape untuk mendeteksi tipe data yang dibutuhkan MySQL
      console.log('ini data', sqlInsert)
      if (sqlInsert.length > 0) {
        let sqlGet = await dbQuery(`select idusers,username,email,status from users where idusers=${sqlInsert[0].idusers};`)
        await transport.sendMail({
          from: 'MYFRIEND OFFICIAL',
          to: sqlGet[0].email,
          subject: 'Verification Email Account',
          html: `<head>
                    <style type="text/css">
                    @media screen {
                      @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                      }
                      @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                      }
                    }
                    body {
                      width: 100% !important;
                      height: 100% !important;
                      padding: 0 !important;
                      margin: 0 !important;
                    }
                    table {
                      border-collapse: collapse !important;
                    }
                    a {
                      color: #1a82e2;
                    }
                    img {
                      height: auto;
                      line-height: 100%;
                      text-decoration: none;
                      border: 0;
                      outline: none;
                    }
                    </style>
                  
                  </head>
                  <body style="background-color: #e9ecef;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" bgcolor="#e9ecef">
                          <!--[if (gte mso 9)|(IE)]>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                              <td align="center" valign="top" style="padding: 36px 24px;">
                              </td>
                            </tr>
                          </table>
                          <!--[if (gte mso 9)|(IE)]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" bgcolor="#e9ecef">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                              <img src="https://i.imgur.com/6TNJNkC.png"  border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;"><br/>
                                <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                              </td>
                            </tr>
                          </table>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" bgcolor="#e9ecef">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                <p style="margin: 0;">Hi ${sqlGet[0].username},</p>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                <p style="margin: 0;">Thank you for signing up to MyFriend, to set your account, please confirm your email address by clicking on the button below</p>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" bgcolor="#ffffff">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                      <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                            <a href="${process.env.FE_URL}/verification?verif=${req.token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Find Your Friend</a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                <p style="margin: 0;font-size:12px"><a href="${process.env.FE_URL}/verification?verif=${req.token}" target="_blank">${process.env.FE_URL}/verification?verif=${req.token}</a></p>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                                <p style="margin: 0;">Best Regards,<br> MyFriend Official</p>
                              </td>
                            </tr>
                  
                          </table>
                          
                          </td>
                          </tr>
                          </table>
                          
                        </td>
                      </tr>
                                      
                    </table>
                    
                  
                  </body>`
        })
        res.status(200).send({
          ...sqlGet[0],
          token: req.token
        });
      }
    } catch (error) {
      console.log('Error query :', error);
      res.status(500).send(error);
    }
  },
  reset: async (req, res) => {
    try {
      console.log(req.query)
      let sqlInsert = await dbQuery(`select * from users u where u.email="${req.query.email.toLocaleLowerCase()}";`) // bisa pake .escape untuk mendeteksi tipe data yang dibutuhkan MySQL
      console.log('ini data', sqlInsert)
      if (sqlInsert.length > 0) {
        let sqlGet = await dbQuery(`select idusers,username,email,status from users where idusers=${sqlInsert[0].idusers};`)
        let token = createToken({ ...sqlGet[0] }, '1h');
        await dbQuery(`update users set tokenReset="${token}" where idusers=${sqlInsert[0].idusers};`)
        let sqlGet1 = await dbQuery(`select idusers,username,email,status,tokenReset from users where idusers=${sqlInsert[0].idusers};`)
        await transport.sendMail({
          from: 'MYFRIEND OFFICIAL',
          to: sqlGet1[0].email,
          subject: 'Reset Password',
          html: `<head>
                    <style type="text/css">
                    @media screen {
                      @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                      }
                      @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                      }
                    }
                    body {
                      width: 100% !important;
                      height: 100% !important;
                      padding: 0 !important;
                      margin: 0 !important;
                    }
                    table {
                      border-collapse: collapse !important;
                    }
                    a {
                      color: #1a82e2;
                    }
                    img {
                      height: auto;
                      line-height: 100%;
                      text-decoration: none;
                      border: 0;
                      outline: none;
                    }
                    </style>
                  
                  </head>
                  <body style="background-color: #e9ecef;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" bgcolor="#e9ecef">
                          <!--[if (gte mso 9)|(IE)]>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                              <td align="center" valign="top" style="padding: 36px 24px;">
                              </td>
                            </tr>
                          </table>
                          <!--[if (gte mso 9)|(IE)]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" bgcolor="#e9ecef">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                              <img src="https://i.imgur.com/6TNJNkC.png"  border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;"><br/>
                                <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Reset Password</h1>
                              </td>
                            </tr>
                          </table>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" bgcolor="#e9ecef">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                <p style="margin: 0;">Hi ${sqlGet1[0].username},</p>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                <p style="margin: 0;">Tap the button below to reset your customer account password. If you didn't request a new password, you can safely delete this email.</p>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" bgcolor="#ffffff">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                      <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                            <a href="${process.env.FE_URL}/resetpassword?reset=${token}&email=${sqlGet1[0].email}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Reset Password</a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                                <p style="margin: 0;">Best Regards,<br> MyFriend Official</p>
                              </td>
                            </tr>
                          </table>
                          </td>
                          </tr>
                          </table>
                        </td>
                      </tr>         
                    </table>
                  </body>`
        })
        res.status(200).send({
          success: true,
          message: 'Reset Success'
        });
      }
    } catch (error) {
      console.log('Error query :', error);
      res.status(500).send(error);
    }
  },
  resetpass: async (req, res) => {
    try {
      await dbQuery(`update users set password="${hashPassword(req.query.password)}" where idusers=${req.dataToken.idusers}`)
      let resultsUser = await dbQuery(`select * from users u where u.idusers=${req.dataToken.idusers};`)
      if (resultsUser.length > 0) {
        let resultsPost = await dbQuery(`select p.*,u.username,u.profilepicture from posting p join users u on p.user_id=u.idusers  where u.idusers=${resultsUser[0].idusers} order by p.date desc; `)
        let resultsLike = await dbQuery(`Select p.*,u.username,u.profilepicture,l.idlikes from posting p join likes l on p.idposting=l.post_id join users u on u.idusers = l.user_id where u.idusers="${resultsUser[0].idusers}"`)
        res.status(200).send({
          ...resultsUser[0],
          posts: resultsPost,
          likes: resultsLike,
          token: req.token
        })
      }
    } catch (error) {
      console.log('Error query :', error);
      res.status(500).send(error);
    }
  },
  login: async (req, res) => {
    try {
      if (req.body.user.includes('@') && req.body.user.toLocaleLowerCase().includes('.com')) {
        let resultsUser = await dbQuery(`select * from users u where u.email="${req.body.user}" and u.password="${hashPassword(req.body.password)}";`)
        if (resultsUser.length > 0) {
          let resultsPost = await dbQuery(`select p.*,u.username,u.profilepicture from posting p join users u on p.user_id=u.idusers  where u.idusers=${resultsUser[0].idusers} order by p.date desc; `)
          let resultsLike = await dbQuery(`Select p.*,u.username,u.profilepicture,l.idlikes from posting p join likes l on p.idposting=l.post_id join users u on u.idusers = l.user_id where u.idusers="${resultsUser[0].idusers}"`)
          let token = createToken({ ...resultsUser[0] });
          res.status(200).send({
            ...resultsUser[0],
            posts: resultsPost,
            likes: resultsLike,
            token
          })
        } else {
          res.status(200).send({
            success: false,
            message: "Login Failed"
          })
        }
      } else {
        let resultsUser = await dbQuery(`select * from users u where u.username="${req.body.user}" and u.password="${hashPassword(req.body.password)}";`)
        if (resultsUser.length > 0) {
          let resultsPost = await dbQuery(`select p.*,u.username,u.profilepicture from posting p join users u on p.user_id=u.idusers  where u.idusers=${resultsUser[0].idusers} order by p.date desc; `)
          let resultsLike = await dbQuery(`Select p.*,u.username,u.profilepicture,l.idlikes from posting p join likes l on p.idposting=l.post_id join users u on u.idusers = l.user_id where u.idusers="${resultsUser[0].idusers}"`)
          let token = createToken({ ...resultsUser[0] });
          res.status(200).send({
            ...resultsUser[0],
            posts: resultsPost,
            likes: resultsLike,
            token
          })
        } else {
          res.status(200).send({
            success: false,
            message: "Login Failed"
          })
        }
      }
    }
    catch (error) {
      console.log('Error query :', error);
      res.status(500).send(error);
    }
  },
  keepLogin: async (req, res) => {
    try {
      let resultsUser = await dbQuery(`select * from users u where u.idusers=${req.dataToken.idusers};`)
      if (resultsUser.length > 0) {
        let resultsPost = await dbQuery(`select p.*,u.username,u.profilepicture from posting p join users u on p.user_id=u.idusers  where u.idusers=${resultsUser[0].idusers} order by p.date desc; `)
        let resultsLike = await dbQuery(`Select p.*,u.username,u.profilepicture,l.idlikes from posting p join likes l on p.idposting=l.post_id join users u on u.idusers = l.user_id where u.idusers="${resultsUser[0].idusers}"`)
        let token = createToken({ ...resultsUser[0] });
        res.status(200).send({
          ...resultsUser[0],
          posts: resultsPost,
          likes: resultsLike,
          token
        })
      }
    } catch (error) {
      console.log('Error query :', error);
      res.status(500).send(error);
    }
  },
  editData: async (req, res) => {
    try {
      let dataInput = JSON.parse(req.body.data);
      console.log(dataInput)
      console.log(req.files)
      if (req.files.length > 0) {
        if (dataInput.bio == null && dataInput.fullname != null) {
          await dbQuery(`update users set username="${dataInput.username}",fullname="${dataInput.fullname}",profilepicture="/imgProfile/${req.files[0].filename}" where idusers=${req.query.id};`)
        } else if (dataInput.fullname == null && dataInput.bio != null) {
          await dbQuery(`update users set bio="${dataInput.bio}", username="${dataInput.username}",profilepicture="/imgProfile/${req.files[0].filename}" where idusers=${req.query.id};`)
        } else if (dataInput.fullname == null && dataInput.bio == null) {
          await dbQuery(`update users set username="${dataInput.username}",profilepicture="/imgProfile/${req.files[0].filename}" where idusers=${req.query.id};`)
        } else {
          await dbQuery(`update users set bio="${dataInput.bio}", username="${dataInput.username}",fullname="${dataInput.fullname}",profilepicture="/imgProfile/${req.files[0].filename}" where idusers=${req.query.id};`)
        }
        res.status(200).send({
          success: true,
          message: 'Edit Profile Success'
        })
      } else {
        if (dataInput.bio == null && dataInput.fullname != null) {
          await dbQuery(`update users set username="${dataInput.username}",fullname="${dataInput.fullname}" where idusers=${req.query.id};`)
        } else if (dataInput.fullname == null && dataInput.bio != null) {
          await dbQuery(`update users set bio="${dataInput.bio}", username="${dataInput.username}" where idusers=${req.query.id};`)
        } else if (dataInput.fullname == null && dataInput.bio == null) {
          await dbQuery(`update users set username="${dataInput.username}" where idusers=${req.query.id};`)
        } else {
          await dbQuery(`update users set bio="${dataInput.bio}", username="${dataInput.username} ",fullname="${dataInput.fullname} " where idusers=${req.query.id};`)
        }
        res.status(200).send({
          success: true,
          message: 'Edit Profile Success'
        });
      }
    } catch (error) {
      console.log('Error query :', error);
      res.status(500).send(error);
    }
  }
}