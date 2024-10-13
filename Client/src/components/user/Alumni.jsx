import React, { useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import { FiSearch } from "react-icons/fi";
import "../../fonts/stylesheet.css";
import Navigation from "./Navigation.jsx";

const alumniData =  [
    {
      "serial_no": 1,
      "name": "Aman Shrivastav",
      "profile_link": "https://www.linkedin.com/in/aman-shrivastav-592110253/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQH332kCTsDn3A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1721487647186?e=1732752000&v=beta&t=SqvySPLcR8-HEU5ca15Ghy3Q65aZvhaXy56xSXVkmts"
    },
    {
      "serial_no": 2,
      "name": "Harshit Poojari",
      "profile_link": "https://www.linkedin.com/in/harshit-poojari-3343b116a/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D5603AQFbYBhspeW5UQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1713095699346?e=1732752000&v=beta&t=YLw_UdMgxWroqgRaNO_UxG8jUyKV_xpff9nCEJw8Q_I"
    },
    {
      "serial_no": 3,
      "name": "Aditya Surve",
      "profile_link": "https://www.linkedin.com/in/aditya-surve-b020a525b/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQFTOtYg7-H-aA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1703605339231?e=1732752000&v=beta&t=vkOqwJ8Hx3YxkjgLl1EQ28S9Akldo91vxt2GvjV1OKI"
    },
    {
      "serial_no": 4,
      "name": "Sachin Mishra",
      "profile_link": "https://www.linkedin.com/in/sachin-mishra-107b93229/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D35AQEENa_NitW2qg/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1721844971075?e=1727960400&v=beta&t=hmrYSHwtqdkPLXyzeJhWflC34aPotILnj-LjUin5j2k"
    },
    {
      "serial_no": 5,
      "name": "Prerna Jaiswal",
      "profile_link": "https://www.linkedin.com/in/prerna-jaiswal-357340296/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQGvdSTwwKGRbw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724906970012?e=1732752000&v=beta&t=YYlnM0NRFHXJfGidLgSdtuMl7ONtEovIo3SNl46VOGE"
    },
    {
      "serial_no": 6,
      "name": "Shreyas Naikwadi",
      "profile_link": "https://www.linkedin.com/in/shreyas-naikwadi-050822258/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D5603AQHeUCrISvA_4Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726687919756?e=1732752000&v=beta&t=d3i-Fd5rAc3LGkBmu1dXQJvbj3PJsGi9f5dBnD2pCu4"
    },
    {
      "serial_no": 7,
      "name": "Aakash Gupta",
      "profile_link": "https://www.linkedin.com/in/aakash-gupta-0a0370237/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQHlTZqu4BtSgw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1689578498457?e=1732752000&v=beta&t=ZdX7SXlNGgy94Qw_d7eiQl1VsHQnYBl0otOTB0fLCaM"
    },
    {
      "serial_no": 8,
      "name": "Chetan Khatri",
      "profile_link": "https://www.linkedin.com/in/chetan-khatri-56710a202/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQF4A938r0zGwA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1704368864921?e=1732752000&v=beta&t=pthX1FlZNfX2D1EV5fZY370e7X98wt694YRGxXIu14o"
    },
    {
      "serial_no": 9,
      "name": "Anushka Pradhan",
      "profile_link": "https://www.linkedin.com/in/anushka-pradhan-7ba2b7215/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D5603AQEHCqHnJYVxQQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1711129022802?e=1732752000&v=beta&t=rFw98YFxtoXY_XKIh6ZdkRFY7AmsEdF67F-v87yilTU"
    },
    {
      "serial_no": 10,
      "name": "Yash Mungekar",
      "profile_link": "https://www.linkedin.com/in/yash-mungekar/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQE1b9rKqxxsBg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1691735798269?e=1732752000&v=beta&t=i_1jn_zo36Zyhx509CWfIML_F_11hSW5Cq7FRGLKlsU"
    },
    {
      "serial_no": 11,
      "name": "Disha Poojary",
      "profile_link": "https://www.linkedin.com/in/disha-poojary-823216225/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQGvbkmb0SuBlQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1705748110228?e=1732752000&v=beta&t=CjCbVnguqdSBo6QmgZ5sI9DI-RKlDNkE2GH0y6RYoFQ"
    },
    {
      "serial_no": 12,
      "name": "Lucky Vaswani",
      "profile_link": "https://www.linkedin.com/in/lucky-vaswani-3248b7243/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQE6ZS3TsMrq7Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1675446851799?e=1732752000&v=beta&t=t9bLmz74xvB_mRUsl0wwiitL45-Cz0nHMkW5Fx3sgh0"
    },
    {
      "serial_no": 13,
      "name": "Mrudula Deshpande",
      "profile_link": "https://www.linkedin.com/in/mrudulasachindeshpande/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQFBA5NzOGV6JQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1688831463868?e=1732752000&v=beta&t=B75g3hrbEbSWYX4ShFl8phQCLRu5NlXJqkW8nt2w8hk"
    },
    {
      "serial_no": 14,
      "name": "Manoj Sudalaimani",
      "profile_link": "https://www.linkedin.com/in/manoj-kumar-sudalaimani/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D5603AQHhAdM52TRMAA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1713536068827?e=1732752000&v=beta&t=F9ZT8KBZ5z-9cY1e-yemQ8MSj35cjlM0mQyE0mQDzYY"
    },
    {
      "serial_no": 15,
      "name": "Pradeep Vahtule",
      "profile_link": "https://www.linkedin.com/in/pradeep-vahatule-138333208/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQEBhutckUkYpA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1718238373467?e=1732752000&v=beta&t=i7YW_CaX7zZpCHQZ5Qx39Bd4ii1x_a2wkFWofFB8VlY"
    },
    {
      "serial_no": 16,
      "name": "Anish Wadekar",
      "profile_link": "https://www.linkedin.com/in/anish-wadekar/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D5635AQFUfJeCYbcWew/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1719439955708?e=1727960400&v=beta&t=oM1OOBBb6G0Fe-HtGHWhYaz2Ol5ZPIVZFr4e5NDQ30w"
    },
    {
      "serial_no": 17,
      "name": "Shreya walavalkar",
      "profile_link": "https://www.linkedin.com/in/shreya-walavalkar-260341299/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQFAM9QPkkvbuA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1705416163466?e=1732752000&v=beta&t=Gg5T2Vj71nDio89vRS5O-eCrPE6DVDsO_Y9x_AJXEcc"
    },
    {
      "serial_no": 18,
      "name": "Anup Ojha",
      "profile_link": "https://www.linkedin.com/in/anup-ojha-11819b217/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQFuLfo8ZoaFgQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724932434447?e=1732752000&v=beta&t=7Ayp4qApb3F6VzRrDPhjeXbb3V5oFf-4I0VVQBVPwN0"
    },
    {
      "serial_no": 19,
      "name": "Sweety Singh",
      "profile_link": "https://www.linkedin.com/in/sweety09602323b/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQE4Grd5DIIziw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1725515120324?e=1732752000&v=beta&t=H5cWAWzszbNU3bXv2svyA1jvFsdiumE06KGV3sBMWB4"
    },
    {
      "serial_no": 20,
      "name": "Heetika Vaity",
      "profile_link": "https://www.linkedin.com/in/heetika-vaity-5297b2279/",
      "profile_photo_link": "https://media.licdn.com/dms/image/v2/D4D03AQE8f78F6AGh7A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707746882979?e=1732752000&v=beta&t=MLK5Dae9jN-3GQa9MvsmZ0wL18hMXNEdPEIMCu2WToA"
    }
  ]

const Alumni = () => {
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setisLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
    <Navigation/>
    <div className="h-full w-full mt-24 flex items-center justify-center text-white overflow-y-auto hide-scrollbar">
      <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex text-white sm:p-3 h-full hide-scrollbar">
        <div className="h-full w-full px-2 flex flex-col">
          <div className="h-[260px] w-full flex flex-col items-center justify-start">
            <h1 className="Geist-semibold text-[40px] text-center">
              Connect with the Alumni
            </h1>
            <p className="Geist text-md text-center leading-6 mt-1 px-2 sm:px-0 text-gray-400">
              Connect with fellow graduates, uncover new opportunities for
              collaboration, and flourish together as a community.
            </p>
            <div className="Geist w-full sm:w-[420px] outline-none mt-6 mb-8 pl-2 md:w-[480px] lg:w-[540px] xl:w-[720px] border-2 border-[#1a1a1a] caret-white placeholder:text-[#68686F] bg-[#09090b] focus:border-gray-700 h-12 text-base text-white rounded-[7px] flex items-center justify-center">
              <FiSearch className="flex items-center justify-center" />
              <input
                maxLength={30}
                type="text"
                placeholder="Search for alumni..."
                className="h-full w-full px-4 outline-none bg-[#09090b] focus:border-gray-700 flex items-center justify-center rounded-[7px]"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
              <button className="bg-gray-700 hover:bg-gray-600 text-white h-full px-3 rounded">
                Search
              </button>
            </div>
          </div>
          <div className="p grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-around place-items-center gap-y-10 overflow-y-auto hide-scrollbar">
            {alumniData.map((alumni) => (
              <ProfileCard
                key={alumni.serial_no}
                username={alumni.name}
                profilePicture={alumni.profile_photo_link}
                profileUrl={alumni.profile_link}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
          {isLoading && <Loader/>}
  </div>
  );
};

export default Alumni;
