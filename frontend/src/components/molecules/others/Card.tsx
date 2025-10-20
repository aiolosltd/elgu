// import React from 'react';

// interface CardProps {
//   icon: string;
//   title: string;
// }

// const Card: React.FC<CardProps> = ({ icon, title }) => {
//   return (
//     <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow h-40">
//       <img src={icon} alt={title} className="h-16 w-16 mb-4" />
//       <h3 className="text-center font-semibold">{title}</h3>
//     </div>
//   );
// };

// export default Card;



// import Card from './Card';

// const guides = [
//   { icon: '/assets/guide.svg', title: 'Preparing an Emergency Go Bag' },
//   { icon: '/assets/guide.svg', title: 'Quezon City Evacuation Centers' },
//   { icon: '/assets/guide.svg', title: 'How to Request for Medical Assistance' },
//   { icon: '/assets/guide.svg', title: 'Tips to Avoid Leptospirosis' },
//   { icon: '/assets/guide.svg', title: 'What to Do in Case of Flood' },
//   { icon: '/assets/guide.svg', title: 'What to Do in Case of Landslide' },
//   { icon: '/assets/guide.svg', title: 'Quezon City Health Centers' },
//   { icon: '/assets/guide.svg', title: 'What to Do in Case of Tropical Cyclone' },
//   { icon: '/assets/guide.svg', title: 'How to Avail of the Emergency Disaster Relief' },
// ];

// const DashboardPage = () => {
//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6 text-center">QC CITIZEN GUIDES</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {guides.map((guide, index) => (
//           <Card key={index} icon={guide.icon} title={guide.title} />
//         ))}
//       </div>
//       <div className="text-center mt-6">
//         <a href="#" className="text-blue-500 hover:underline">
//           More Guides
//         </a>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;